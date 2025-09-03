import fs from 'fs';
import path from 'path';
import { loggerService } from '../utilities';

import providerListFull from './providers.json';

const dirPath = `${__dirname}/json`;

const { AVAILABLE_PROVIDERS_CONFIG = '', DISABLED_PROVIDERS_CONFIG = '' } = process.env;

let providerList : any = [];

let AVAILABLE_PRODVIDERS_LIST : any = [];
let DISABLED_PROVIDRERS_LIST : any = [];

try {
  DISABLED_PROVIDRERS_LIST = DISABLED_PROVIDERS_CONFIG.trim().split(',').map((i) => i.toString().trim().toLowerCase());
  if (DISABLED_PROVIDRERS_LIST.length) {
    providerList = providerListFull
      .filter((item : any) => !DISABLED_PROVIDRERS_LIST.includes(item.id));
    // console.log('providerList', providerList);
    // console.log('providerListFull', providerListFull);
  }
} catch (e) {
  console.log('DISABLED_PROVIDRERS_LIST', e);
}

if (!DISABLED_PROVIDERS_CONFIG) {
  try {
    AVAILABLE_PRODVIDERS_LIST = AVAILABLE_PROVIDERS_CONFIG.trim().split(',').map((i) => i.toString().trim().toLowerCase());

    if (AVAILABLE_PRODVIDERS_LIST.length) {
      providerList = providerListFull
        .filter((item : any) => AVAILABLE_PRODVIDERS_LIST.includes(item.id));
    }
  } catch (e) {
    console.log('AVAILABLE_PRODVIDERS_LIST', e);
  }
}

if (!providerList.length) {
  providerList = providerListFull;
}

providerList = providerList.filter((item: any) => item.released);

const providerMap : {[ key: string]: any} = {};

providerList.forEach((provider: any) => {
  providerMap[provider.id] = provider;
});

const load = () => {
  const list = fs.readdirSync(dirPath);
  const json : { [key: string]: any } = {};

  try {
    list.forEach((item) => {
      const provider_name = item.split('.')[0];
      const found = providerList.filter((provider : any) => provider_name === provider.id);
      if (!found.length) return;
      const filePath = path.resolve(__dirname, `./json/${item}`);
      const name = item.split('.')[0];
      json[name] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
  } catch (e) {
    loggerService.error(e);
    throw e;
  }

  const providers : { [ key: string ]: any } = {
    ...json,
  };

  return providers;
};

const providers = () => load();

const providerListExport : any = [...providerList];

export default load();

export {
  providers,
  providerListExport as providerList,
  providerMap,
};
