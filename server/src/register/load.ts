// Providers and Custom API related modules
import mode from './mode.json';
import api from '../api-access';

import apiExtra from '../api-extra';

// Admin / Dashboard modules
import oauth from '../oauth';
import openapi from '../openapi';
import core from '../core';

const availableModules: { [key: string]: any} = {
  oauth,
  core,
  openapi,
  apiExtra,
  api,
};

const modeMap: any = mode;
const list : any = Object.keys(modeMap);
const selected : string = list.length ? list[0] : '';

export { availableModules, mode, selected };
