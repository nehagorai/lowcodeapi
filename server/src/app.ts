import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import express, {
  Application, Request, Response, NextFunction,
} from 'express';

import config from './config';
import boot from './boot';

import registerModules from './register';

import { loggerService } from './utilities';

const { MOUNT_POINT = '', IP_LOGGING = false } = config;

const app: Application | any = express();

if (process.env.IS_NODE_ENV_DEVELOPMENT) {
  app.use(logger('dev'));
}
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));

app.config = config;

app.use(compression({
  threshold: 512,
  level: 5,
  memLevel: 5,
}));

boot(app, IP_LOGGING);
registerModules(app);

app.get(`${MOUNT_POINT}/health-check`, async (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.on('ready', () => {
  const port = app.get('port');
  loggerService.info(`Application started on port:${port}`);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  if (process.env.IS_NODE_ENV_DEVELOPMENT) {
    res.locals.error = req.app.get('env') === 'development' ? err : { message: err.message };
    loggerService.info({
      path: req.path,
      message: err.message,
    }, err);
  }
  // render the error page
  res.status(err.status || 500);

  if (!res.headersSent) {
    res.json({
      message: err.message,
    });
  }
});

export default app;
