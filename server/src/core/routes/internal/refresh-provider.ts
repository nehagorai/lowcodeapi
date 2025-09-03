import express, { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import _ from 'lodash';

import config from '../../../config';
import endpoint from '../../utilities/endpoint';
import { loggerService, safePromise } from '../../../utilities';

const {
  API_TOKEN: api_token,
  PROVIDERS_GOOGLESHEET_ID: spreadsheet_id,
} = process.env;

const PARAM_KEY_DELIMITER = process.env.PARAM_KEY_DELIMITER || ',';
const PARAM_VALUE_SEPARATOR = process.env.PARAM_VALUE_SEPARATOR || ':';
const PARAM_DEFAULT_VALUE_SEPARATOR = process.env.PARAM_DEFAULT_VALUE_SEPARATOR || '/';

const getOauthConfig = (provider: string, meta : { [key : string]: any} = {}) => {
  if (!provider) return null;
  if (meta.auth_type !== 'OAUTH2.0') return;
  return {
    auth_link: `/auth/${provider.toLowerCase()}`,
    setup: [
      {
        name: 'client_id',
        type: 'input',
        field: 'input',
        label: 'OAuth2.0 Client ID',
        required: true,
        className: '',
        placeholder: `Enter ${provider} OAuth2.0 Client ID`,
        message: `${provider} OAuth2.0 Client Secret`,
      },
      {
        name: 'client_secret',
        type: 'input',
        field: 'input',
        label: 'OAuth2.0 Client Secret',
        required: true,
        className: '',
        placeholder: `Enter ${provider} OAuth2.0 Client Secret`,
        message: `${provider} OAuth2.0 Client Secret`,
      },
    ],
  };
};

// const getAuthMode = () => ({
//   header: {
//     headerName: 'Authorization',
//     headerValue: 'Bearer',
//     authKey: 'accessToken',
//   },
// });

const router: Router = express.Router();

const convertToIntent = async (url: string, service = '') => {
  const [error, data] = await safePromise(axios.get(url));
  if (error) throw error;

  const { res, ...rest } = data.data;
  const { info: meta } = rest;
  console.log({ total: res.length }, rest.info);

  const routes: any = {};
  let auth: any = null;
  if (rest.info && rest.info.auth) {
    try {
      auth = JSON.parse(rest.info.auth);
    } catch (e) {
      console.log(`Auth parse error ${rest.info.auth}`, e);
    }
  }
  let headers: any = null;
  if (rest.info && rest.info.headers) {
    try {
      headers = JSON.parse(rest.info.headers);
    } catch (e) {
      console.log(`Headers parse error ${rest.info.headers}`);
    }
  }
  let param_replace_key: any = null;
  if (rest.info.param_replace_key) {
    try {
      param_replace_key = JSON.parse(rest.info.param_replace_key);
    } catch (e) {
      console.log(`Error parse error ${rest.info.param_replace_key}`, e);
    }
  }
  const intentCount : {[key: string]: any } = { };
  _.sortBy(res, ['level', 'category'])
    .filter((i) => !i.hide)
    .forEach((item) => {
      intentCount[item.provider_intent] = intentCount[item.provider_intent]
        ? (intentCount[item.provider_intent] + 1)
        : 1;
      const local = { ...item };

      let examples: any = {};

      if (local.example_payload) {
        try {
          examples = JSON.parse(local.example_payload);
        } catch (e) {
          console.log('Example payload error', e, local.example_payload);
        }
      }

      ['params', 'body', 'path'].forEach((item) => {
        try {
          local[item] = JSON.parse(local[item]);
        } catch (e) {
          const vars = local[item];
          const obj : any = {};
          if (vars) {
            const params = vars.split(PARAM_KEY_DELIMITER);
            params.forEach((param: any) => {
              const lp = param && param.trim().split(PARAM_VALUE_SEPARATOR);
              if (lp.length) {
                // console.log({ item, param, lp });
                if (lp[0] && lp[0].trim()) {
                  const key = lp[0].trim();
                  const type = lp[1] ? lp[1].trim() : '';
                  const required = !!lp[2]; // require check
                  const text = lp[3] ? lp[3].trim() : '';
                  const supportedValues = lp[4]
                    ? lp[4].trim().split(PARAM_DEFAULT_VALUE_SEPARATOR) : [];
                  const disabled = !!lp[5]; // require check
                  obj[key] = {
                    type,
                  };
                  if (text) {
                    obj[key].text = text;
                  }

                  if (required) {
                    obj[key].required = !!required;
                  }

                  if (disabled) {
                    obj[key].disabled = !!disabled;
                  }
                  if (type && type === 'boolean') {
                    obj[key].enum = [true, false];
                  }

                  if (supportedValues && supportedValues.length) {
                    obj[key].enum = supportedValues;
                  }

                  if (type && (type === 'enum')) {
                    obj[key].enum = supportedValues;
                  }

                  if (item === 'body' && examples[key]) {
                    obj[key].examples = examples[key];
                  }

                  if (param_replace_key && param_replace_key[key]) {
                    obj[key].replace_key = param_replace_key[key];
                    if (param_replace_key.key_alias) {
                      obj[key].key_alias = param_replace_key.key_alias;
                    }
                  }
                }
              }
            });
          }

          local[item] = obj;
        }
      });

      try {
        local.custom_headers = JSON.parse(local.custom_headers);
      } catch (e) {
        local.custom_headers = {};
      }
      try {
        local.meta = JSON.parse(local.meta);
      } catch (e) {
        console.log(e);
        const vars = local.meta;
        const obj: any = {};
        if (vars) {
          const params = vars.split(',');
          // a:b,
          params.forEach((param: any) => {
            const lp = param && param.trim().split(':');
            if (lp.length) {
              if (lp[0]) {
                const key = lp[0].trim();
                const value = lp[1] ? lp[1].trim() : '';
                obj[key] = {
                  type: value,
                };

                if (value && value === 'boolean') {
                  obj[key].enum = [true, false];
                }
              }
            }
          });
        }
        local.meta = {};
      }
      try {
        local.rate_limit = JSON.parse(local.rate_limit);
      } catch (e) {
      // console.log('rate_limit parse error');
        local.rate_limit = [];
      }

      if (local.auth) {
        try {
          local.auth = JSON.parse(local.auth);
        } catch (e) {
          console.log(`Parsing ${local.auth} error`, e, local.provider_intent);
        }
      }
      local.text = local.wip ? `${local.text.trim()} 🚧` : local.text.trim();

      local.params = {
        ...local.path,
        ...local.params,
      };
      local.meta = {
        version: local.version,
        auth: [],
        description: local.description || local.text,
        rate_limit: local.rate_limit,
        api_endpoint: local.api_endpoint,
        alias_endpoint: local.alias_endpoint,
        api_ref: local.api_ref || '',
      };
      local.wip = (local.wip === 'FALSE' || !local.wip) ? 0 : 1;
      local.method = local.method.trim();
      local.version = undefined;

      // Backward compatibility check for array
      if (auth && (Array.isArray(local.auth) && !Object.keys(local.auth).length)) {
        local.auth = auth;
      }
      local.payload_type = rest.info.payload_type || '';
      if (headers) {
        local.headers = headers;
      }
      local.description = undefined;
      local.rate_limit = undefined;
      local.api_endpoint = undefined;
      local.alias_endpoint = undefined;
      local.api_ref = undefined;
      local.level = undefined;
      local.example_payload = undefined;

      // handle legacy first before using provider_intent
      if (local.provider_alias_intent_exception) {
        local.provider_alias_intent = local.provider_alias_intent_exception;
      }
      local.provider_intent = local.intent || local.provider_intent;

      routes[local.provider_intent] = local;
    });
  const intent = {
    app: {
      title: `${service} API`,
      description: '',
      api_base: `/${service.toLowerCase()}`,
      copyright: '',
      copyright_year: '',
      contact_email: '',
    },
    category: {
      All: '',
    },
    routes,
  };
  const jsonIntent = JSON.stringify(intent, null, 2);

  let auth_config = null;

  try {
    auth_config = getOauthConfig(service, meta) || JSON.parse(meta.auth_config);
  } catch (e: any) {
    console.log(e.message, 'auth_config');
  }

  const extra = {
    id: meta.provider,
    alias: meta.alias || undefined,
    href: intent.app.api_base,
    name: meta.name || service,
    auth_type: meta.auth_type || undefined,
    auth_config,
    provider_link: meta.credential_link,
    logo: true,
    disabled: meta.disabled || false,
    released: meta.released || true,
    visible: meta.visible || true,
  };
  return { intent, json: jsonIntent, extra };
};

// Temporary provision to match the path, used inconjuctions with intent js file
const { HIDDEN_INTENT_DIR } = process.env;
const HIDDEN_JSON_DIR = HIDDEN_INTENT_DIR || 'dist/intents';

const { API_ENDPOINT } = endpoint.getOptions();
const getGooglesheetUrlForFetch = ({
  spreadsheet_id, tab, row = 2, api_token,
}: { [key: string]: any }) => `${API_ENDPOINT}/spreadsheets/spreadsheetid/get?spreadsheetId=${spreadsheet_id}&tab=${tab}&row=${row}&api_token=${api_token}`;

router.get('/:m1gonaon/:provider', async (req: Request, res: Response) => {
  const { m1gonaon, provider } = req.params;

  if (!config.INTERNAL_ACCESS_KEYS || !config.INTERNAL_ACCESS_KEYS.includes(m1gonaon)) {
    return res.status(403).json({
      message: "You don't have rights to access this API.",
    });
  }

  const url = getGooglesheetUrlForFetch({
    spreadsheet_id,
    tab: provider,
    row: 7,
    api_token,
  });
  const [error, data] = await safePromise(convertToIntent(`${url}&cache_burst=1`, provider));

  if (error) {
    loggerService.error('coversion error ', error);
    res.json({ ok: false });
  } else {
    const file = path.resolve(`${HIDDEN_JSON_DIR}`, '.json', `${provider.toLowerCase()}.json`);
    loggerService.info(file);
    fs.writeFile(file, data.json, (error) => {
      if (error) {
        loggerService.error('saving error is', error);
        return res.json({ ok: false });
      }
      res.json({ ok: 1 });
    });
  }
});
export default router;
