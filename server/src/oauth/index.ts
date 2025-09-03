import { Application } from 'express';

import google from './google';
import googleServices from './google-services';
import trello from './trello-1a';
import oauth2 from './oauth2';

export default (app: Application): void => {
  google(app);
  googleServices(app);
  trello(app);
  oauth2(app);
  // loggerService.info('OAuth modules initialized.');
};
