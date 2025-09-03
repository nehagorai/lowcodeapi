import { Application } from 'express';
import { availableModules, mode, selected } from './load';
// api module should always be last in order

const MODULE_MAP : { [key: string]: any} = {
  ...mode,
};

const { APPLICATION_MODE = selected || 'monolith' } = process.env;

const registerModules : [] = MODULE_MAP[APPLICATION_MODE.toLowerCase()] || [];

if (!registerModules.length) {
  const message = 'Unable to load the application.';
  console.log(message);
  throw message;
}
export default (app: Application): void => {
  registerModules.forEach((module) => {
    if (availableModules[module]) {
      availableModules[module](app);
    }
  });
};
