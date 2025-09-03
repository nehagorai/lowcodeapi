import express, { Request, Response, Router } from 'express';

import config from '../../../config';

const router: Router = express.Router();

router.post('/:m1gonaon/log-intent-request', async (req: Request, res: Response) => {
  const { m1gonaon } = req.params;

  if (!config.INTERNAL_ACCESS_KEYS || !config.INTERNAL_ACCESS_KEYS.includes(m1gonaon)) {
    return res.status(403).json({
      message: "You don't have rights to access this API.",
    });
  }
  res.json({ ok: 1 });
});
export default router;
