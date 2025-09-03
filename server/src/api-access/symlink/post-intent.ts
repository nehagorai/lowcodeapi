import { loggerService, safePromise } from '../../utilities';

import generic from '../../api-dispatch';
import intents from '../../intents';

const getProviderKey = (query: { spreadsheetId: any; documentId: any; }) => {
  const key = query.spreadsheetId || query.documentId || ''; // FIX this hardcode
  return key;
};

async function next(
  route: { provider_intent: string | number, text: string },
  keys: { [key: string]: any },
) {
  const {
    provider,
    app,
    query,
    params,
    body,
    headers: clientHeaders,
    file,
    apiParams = {},
  } = keys;

  const providerConfig : { [key: string]: any } = {};

  apiParams[route.provider_intent].query_params.forEach((param : string | number) => {
    if (query[param]) {
      providerConfig[param] = query[param];
    }
  });

  let options : {[key: string]: any} = {
    app,
    authToken: app.authToken,
    routeMap: {
      ...route,
      provider_key: getProviderKey(query) || getProviderKey(body) || '',
      provider_config: providerConfig,
      data: body,
      body,
      query,
    },
  };

  let selectedProviderEngine = null;

  if (!selectedProviderEngine && intents[provider]) {
    selectedProviderEngine = generic;
    options = {
      provider,
      target: route,
      payload: {
        query: { ...query, api_token: undefined },
        params: { ...query, ...params, api_token: undefined },
        body,
        headers: clientHeaders,
      },
      authObj: app.authToken,
      credsObj: app.credsObj,
    };
    if (file) {
      options.payload.file = file;
    }
    // loggerService.info(`No custom implementation for ${provider}`);
    // loggerService.info('Using generic HTTP POST rest implementation');
  } else {
    loggerService.info(`Custom implementation exist for ${provider}`);
    loggerService.info(`Using /integrations/${provider}`);
  }

  loggerService.info('selected intent', route.text);

  if (!selectedProviderEngine) {
    const error : { [key: string]: any } = new Error('Unknown provider');
    error.code = 422;
    throw error;
  }
  const [providerError, response] = await safePromise(selectedProviderEngine(options));

  if (providerError) {
    const message = providerError.message || 'Error processing the request';
    const error : { [key: string]: any } = new Error(message);

    if (providerError.headers) {
      error.headers = providerError.headers;
    }

    error.data = providerError.data || providerError.errors || providerError.error;

    error.code = providerError.code || 500;
    throw error;
  }

  const { data, meta = {}, headers } = response;

  return {
    data,
    ...meta,
    headers: (meta && meta.headers) ? meta.headers : (headers || {}),
  };
}

export default next;
