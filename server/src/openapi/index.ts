import { Application } from 'express';

import { loggerService } from '../utilities';
import loadOpenApiDefinition from './handler';
import loadMetadata from './metadata';

export default (app: Application) => {
  app.get('/:provider/definition', loadOpenApiDefinition);
  app.post('/:provider/definition', loadOpenApiDefinition);
  app.get('/:provider/metadata', loadMetadata);
  loggerService.info('Definition module initialized.');
};
