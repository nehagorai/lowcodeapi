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
    v, type, devjson, category, paths: urlPath, keys,
  } = req.query;
  const { provider } = req.params;
  let routesMaps = null;
  if (intents[provider] && !devjson) {
    routesMaps = intents[provider];
  }

  if (!routesMaps) {
    return res.status(422).json({
      message: 'Invalid OpenAPI definition request.',
    });
  }

  const app: { [key: string] : any } = { ...routesMaps.app };
  app.filters = {
    v, type, category, urlPath, keys,
  };
  const openApiJSON = openapi({ ...routesMaps, app, user });

  const build = req.query.build ? routesMaps : openApiJSON;
  res.json({
    message: `API definition for ${provider}`,
    res: {
      ...build,
    },
  });
};

export default handler;
