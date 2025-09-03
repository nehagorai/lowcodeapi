/* eslint-disable no-underscore-dangle */
import { Application, Request } from 'express';

import passport from 'passport';
// @ts-ignore
import { Strategy } from 'passport-trello';

import config from '../config';
import endpoint from '../core/utilities/endpoint';
import safePromise from '../utilities/safe-promise';

import {
  fetchProvidersCustomOauthCredentials,
} from '../core/services/providers';
import {
  usersActivatedProvider,
} from '../core/services/user';

import db from '../core/db';
import {
  cryptograper,
  loggerService,
} from '../utilities';

const { User, ProvidersCredentialAndToken } = db.models;
const { AUTH_MOUNT_POINT } = config;

const provider = 'TRELLO';
const AUTH_TYPE = 'OAUTH1.0';
let { API_KEY, API_SECRET } = config.OAUTH[provider] || {};

const AUTH_PATH = `${AUTH_MOUNT_POINT}/${provider.toLowerCase()}`;
const AUTH_CALLBACK_PATH = `${AUTH_PATH}/callback`;
const CALLBACK_URL = `${config.PROTOCOL}://${config.APP_DOMAIN}${AUTH_CALLBACK_PATH}`;

export default (app: Application): void => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: any, done) => {
    done(null, id);
  });

  const cb = (API_KEY: string) => async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: { [key: string]: any },
    cb: any,
  ) => {
    loggerService.info(profile);
    if (req.session) {
      loggerService.info('Session Found', req.session);
      const [error, userDataObj] = await safePromise(
        User.findOne({
          where: {
            id: req.session.user!.id,
          },
        }),
      );

      if (error) {
        return cb(error);
      }
      let userData = userDataObj;
      if (userData) {
        userData = userData.toJSON();
        userData.new = false;
      }

      let updateStatus = null;
      if (!userData.new) {
        const update = {
          config: {
            encrypted: cryptograper.encrypt(
              {
                refreshToken,
                accessToken,
                token: accessToken,
                key: API_KEY,
              },
            ),
          },
          provider_data: profile._json,
        };
        const [error, data] = await safePromise(
          ProvidersCredentialAndToken.update(update, {
            where: {
              user_ref_id: userData.ref_id,
              provider: provider.toLowerCase(),
            },
          }),
        );
        if (error) {
          loggerService.error('Error updating provider token ', { error });
          return cb(error);
        }
        updateStatus = data ? data[0] : null;
      }

      if (!updateStatus) {
        const payload: any = {
          user_id: userData.id,
          user_ref_id: userData.ref_id,
          provider: provider.toLowerCase(),
          auth_type: AUTH_TYPE,
          config: {
            encrypted: cryptograper.encrypt(
              {
                refreshToken,
                accessToken,
                token: accessToken,
                key: API_KEY,
              },
            ),
          },
          provider_data: profile._json,
        };

        const [tokenError] = await safePromise(
          ProvidersCredentialAndToken.create(payload),
        );

        if (tokenError) {
          return cb(tokenError);
        }
      }

      const [activationError] = await safePromise(
        usersActivatedProvider({
          user: userData,
          provider: provider.toLowerCase(),
        }),
      );

      if (activationError) {
        return cb(activationError);
      }
    }
    cb(null, profile);
  };

  // @ts-ignore
  const dispatchLogin = passport.authenticate(
    provider.toString().toLowerCase(),
    { scope: 'read,write,account', expiration: 'never' },
  );
  app.get(
    `${AUTH_PATH}`,
    async (req, res, next) => {
      if (req.session && req.session.user) {
        loggerService.info(
          req.session,
          provider.toLowerCase(),
          ' login intent',
        );
        const { user } = req.session;
        const [error, auth] = await safePromise(
          fetchProvidersCustomOauthCredentials({
            user_ref_id: user.ref_id,
            provider: provider.toLowerCase(),
            auth_type: AUTH_TYPE,
          }),
        );

        if (error) {
          loggerService.error('users auth creds not fetched', error);
        } else if (
          auth[provider.toLowerCase()]
          && auth[provider.toLowerCase()].creds
        ) {
          const { creds } = auth[provider.toLowerCase()];

          if (creds.encrypted) {
            try {
              const decrypted = JSON.parse(cryptograper.decrypt(creds.encrypted.value));
              API_KEY = decrypted.API_KEY;
              API_SECRET = decrypted.API_SECRET;
            } catch (error) {
              loggerService.error('Provider: Error decrypting the creds', provider, error);
              return res.json({ message: 'There was an error processing the request.' });
            }
          } else {
            API_KEY = creds.API_KEY;
            API_SECRET = creds.API_SECRET;
          }

          loggerService.info('Using user specific auth credentials.');
        } else {
          loggerService.info(
            'No user specific auth credentials, will be using global creds.',
          );
        }
      }
      if (!API_KEY || !API_SECRET) {
        loggerService.info('API_KEY or API_SECRET is not configured.');
        return res.redirect(endpoint.providerFailureRedirectUrl(provider.toLowerCase(), ''));
      }
      passport.use(
        new Strategy(
          {
            consumerKey: API_KEY,
            consumerSecret: API_SECRET,
            callbackURL: CALLBACK_URL,
            passReqToCallback: true,
          },
          cb(API_KEY || ''),
        ),
      );
      next();
    },
    dispatchLogin,
  );

  app.get(
    `${AUTH_CALLBACK_PATH}`,
    passport.authenticate(provider.toLowerCase(), {
      failureRedirect: endpoint.providerFailureRedirectUrl(provider, ''),
    }),
    (req, res) => {
      loggerService.info('All good');
      const target = provider.toLowerCase();
      const redirect = endpoint.providerSuccessRedirectUrl(target);
      res.redirect(redirect);
    },
  );
};
