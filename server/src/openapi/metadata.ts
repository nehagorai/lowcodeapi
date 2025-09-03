import { Request, Response } from 'express';

import intents from '../intents';
import { verify } from '../core/common/key-hash';

import sanitize from './api-util';

import { loggerService, safePromise } from '../utilities';

interface Session {
  user: {
    id: any,
    [key: string]: any
  };
}

// Internal build api
const metadata = async (req: Request, res: Response) => {
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
  const { devjson } = req.query;
  const { provider } = req.params;
  let routesMaps = null;
  if (intents[provider] && !devjson) {
    routesMaps = intents[provider];
  } else {
    // Handle devjson case if needed
  }

  if (!routesMaps) {
    return res.status(422).json({
      message: 'Invalid OpenAPI definition request.',
    });
  }

  const { routes } : { [key: string] : any } = { ...routesMaps };
  const categories: { [key: string]: any} = {};

  Object.keys(routes).forEach((route) => {
    const intent = routes[route];
    const method = intent.method.toLowerCase();
    if (categories[intent.category]) {
      categories[intent.category].paths.push(intent.provider_alias_intent, `${intent.provider_alias_intent}~${method}`);
    } else {
      const category_id = sanitize(intent.category);

      categories[intent.category] = {
        id: category_id,
        paths: [intent.provider_alias_intent, `${intent.provider_alias_intent}~${method}`],
      };
    }
  });
  res.json({
    message: `API metadata for ${provider}`,
    res: {
      ...categories,
    },
  });
};

export default metadata;
