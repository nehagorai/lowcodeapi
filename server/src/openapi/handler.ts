import { Request, Response } from 'express';

import openapi from './definition';
import intents from '../intents';
import { verify } from '../core/common/key-hash';

import { loggerService, safePromise } from '../utilities';

interface Session {
  user: {
    id: any,
    [key: string]: any
  };
}

const handler = async (req: Request, res: Response) => {
  let { user } : { [key: string]: any } = req.session as Session;
  if (!user && req.headers['x-auth-token']) {
    const { headers } : { [key: string]: any } = req;
    const [error, jwtUser] = await safePromise(verify(headers['x-auth-token']));
    if (error || !jwtUser || !jwtUser.id) {
      loggerService.error('Error or no user ', error || jwtUser);
    } else {
      user = jwtUser;
    }
  }
  const {
    v, type, devjson, extra_key, category, paths: urlPath, keys,
  } = req.query;

  const intentPaths: { [key: string]: any } = {};
  if (req.method.toUpperCase() === 'POST' && req.body.intents) {
    const { intents } = req.body;
    intents.forEach((intent: any) => {
      intentPaths[`${intent.path}-${intent.method}`.toLowerCase()] = `${intent.path}-${intent.method}`.toLowerCase();
    });
  }
  const { provider } = req.params;
  let routesMaps = null;
  if (intents[provider] && !devjson) {
    routesMaps = intents[provider];
  }

  if (!routesMaps) {
    return res.status(422).json({
      message: 'Invalid request for OpenAPI specs',
    });
  }
  const app: { [key: string] : any } = { ...routesMaps.app }; // .app is legacy, no longer used
  app.filters = {
    v, type, category, urlPath, keys, intentPaths,
  };
  const openApiJSON = openapi({
    ...routesMaps, app, user, extra_key,
  });
  res.json({
    ...openApiJSON,
  });
};

export default handler;
