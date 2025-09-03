import { Application } from 'express';
import refreshProvider from './refresh-provider';
import getCreds from './get-creds';
import logIntentRequest from './log-intent-request';
import logRequest from './log-request';
import telemetry from './telemetry';
import build from './build';

export default (app: Application) => {
  app.use('/internal', logRequest);
  app.use('/internal', logIntentRequest);
  app.use('/internal', refreshProvider);
  app.use('/internal', getCreds);
  app.use('/internal', telemetry);
  app.use('/api/v1', build);
};
