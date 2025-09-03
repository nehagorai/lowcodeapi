import express, { Request, Response, Router } from 'express';
import { loggerService, safePromise } from '../../../utilities';
import { notify } from '../../../utilities/notify';

const router: Router = express.Router();

router.get('/telemetry', async (req: Request, res: Response) => {
  const { location, date, ref } = req.query;
  const { headers } = req;
  res.json({ ok: 1 });
  loggerService.info('Telemetry', { location, date, ref });
  const text = `

Distribution: ${location}
Build Date: ${date}
Build Ref: ${ref}
🌐 IP: ${headers['x-real-ip'] || headers['x-forwarded-for'] || 'local'}

    `;
  const [error] = await safePromise(notify(text));
  if (error) {
    loggerService.error(error);
  }
});

export default router;
