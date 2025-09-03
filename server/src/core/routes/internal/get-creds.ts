import express, { Request, Response, Router } from 'express';
import config from '../../../config';
import { safePromise, loggerService } from '../../../utilities';

import getProviderCredsUsingApiTokenFn from '../../services/providers/api-token-fn';

const router: Router = express.Router();

router.post('/:m1gonaon/get-creds', async (req: Request, res: Response) => {
  const { m1gonaon } : { [key: string]: any } = req.params;
  const { api_token, provider } = req.body;

  if (!config.INTERNAL_ACCESS_KEYS || !config.INTERNAL_ACCESS_KEYS.includes(m1gonaon)) {
    return res.status(401).json({
      message: "You don't have rights to access this API.",
    });
  }

  const [error, creds] = await safePromise(
    getProviderCredsUsingApiTokenFn({ api_token, provider }),
  );

  if (error) {
    loggerService.error(error, req.body);
    return res.status(500).json({
      message: 'Error loading services',
    });
  }
  res.json({
    res: creds,
  });
});

export default router;
