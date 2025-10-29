import { Application } from 'express';
import cors, { CorsOptions } from 'cors';

import { loggerService } from '../utilities';

const plugCors = (app: Application): void => {
  const corsOptions: CorsOptions = {
    credentials: true,
    origin: true,
    allowedHeaders:
          'Accept, Origin, X-Requested-With, x-auth-token, X-Auth-Token, Authorization, Content-Type, content-type, Cache-Control, Access-Control-Allow-Origin',
  };

  app.use(cors(corsOptions));
};

const plugIpLogging = (app: Application): void => {
  app.use((req, res, next) => {
    const { headers } = req;
    const ip = headers['x-forwarded-for'] || headers['x-real-ip'];
    loggerService.info(`Request from IP: ${ip} ${(new Date().toUTCString())}`, req.path);
    next();
  });
};

export default (app: Application, IP_LOGGING: boolean): void => {
  plugCors(app);
  if (IP_LOGGING) {
    plugIpLogging(app);
  }
};
