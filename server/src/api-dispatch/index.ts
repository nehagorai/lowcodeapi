import FormData from 'form-data';
import fs from 'fs';
import qs from 'qs';
import { parseStringPromise } from 'xml2js';
import {
  sendRequest,
  safePromise,
  loggerService,
} from '../utilities';

import prepare from './prepare';
import errorHandler from './error-handler';
import refreshToken from './refresh-token';
import {
  AccessReturn,
  AuthResult,
  SubdomainResult,
  ProcessSubdomainParams,
  ApplyAuthenticationParams,
  AccessParams,
} from './types';

const METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

const getKeyPatternList = (key: string) => [`{${key}}`, `:${key}`, `<${key}>`];

function applyAuthentication({
  authDefault,
  authObj,
  url,
  requestHeaders,
  body,
}: ApplyAuthenticationParams): AuthResult {
  const options: { [key: string]: any } = {
    method: '',
    headers: {},
  };

  if (authDefault && authDefault.header) {
    // converting object to array of object to support multiple custom headers.
    const headerArray = Array.isArray(authDefault.header)
      ? authDefault.header : [authDefault.header];

    headerArray.forEach((header: any) => {
      const headerName = header.headerName ? header.headerName.trim() : '';

      if (headerName) {
        const headerValue = header.headerValue ? header.headerValue.trim() : '';
        if (headerValue) {
          requestHeaders[headerName] = `${headerValue} ${authObj[header.authKey]}`;
        } else {
          requestHeaders[headerName] = authObj[header.authKey];
        }
      }
    });
    options.headers = requestHeaders;
  } else if (authDefault && authDefault.basicauth) {
    options.auth = {
      username:
        authObj[authDefault.basicauth.username]
        || authDefault.basicauth.username, // hack for mailgun
      password: authObj[authDefault.basicauth.password],
    };
  } else if (authDefault && authDefault.query) {
    const { query = [] } = authDefault;
    query.forEach((key: string, index: number) => {
      if (authObj[key]) {
        if (index === 0) {
          url = `${url}?${key}=${authObj[key]}`;
        } else if (query.length !== index + 1) {
          url = `${url}&${key}=${authObj[key]}`;
        } else {
          url = `${url}&${key}=${authObj[key]}`;
        }
      }
    });
  } else if (authDefault && authDefault.queryMap) {
    // New case for facebook authentication where OAuth access token is sent as query param
    const { queryMap = {} } = authDefault;
    const keys = Object.keys(queryMap);
    keys.forEach((key: string, index: number) => {
      if (authObj[queryMap[key]]) {
        if (index === 0) {
          const fragment = /\?/.test(url) ? '&' : '?'; // if the url has ? then use &, otherwise ?
          url = `${url}${fragment}${key}=${authObj[queryMap[key]]}`;
        } else if (keys.length !== index + 1) {
          url = `${url}&${key}=${authObj[queryMap[key]]}`;
        } else {
          url = `${url}&${key}=${authObj[queryMap[key]]}`;
        }
      }
    });
  } else if (authDefault && authDefault.path) {
    // New case for facebook authentication where OAuth access token is sent as query param
    const { path = {} } = authDefault;
    const keys = Object.keys(path);
    keys.forEach((key) => {
      const value = authObj[path[key]];
      if (value) {
        const replacePattern = getKeyPatternList(key);
        let found = false;
        // FIX: Improve this loop;
        replacePattern.forEach((replace) => {
          if (found) return;
          if (new RegExp(replace).test(url)) {
            url = url.replace(replace, value);
            found = true;
          }
        });
      }
    });
  } else if (authDefault && authDefault.body) {
    // New case for facebook authentication where OAuth access token is sent as query param
    const { body: bodyMap } = authDefault;
    const keys = Object.keys(bodyMap);
    keys.forEach((key: string) => {
      body[key] = authObj[bodyMap[key]];
    });
  } else {
    const error: { [key: string]: any } = new Error(
      'Authentication mode not implemented.',
    );
    error.code = 401;
    throw error;
  }

  return { url, options, requestHeaders, body };
}

function processSubdomain({
  subdomain,
  domain_params,
  url,
  localParams,
  oauth_data,
  authObj,
}: ProcessSubdomainParams): SubdomainResult {
  let localSubDomain: { [key: string]: any } = {};
  if (subdomain && Object.keys(subdomain).length) {
    localSubDomain = subdomain;
  } else if (domain_params && Object.keys(domain_params).length) {
    localSubDomain = domain_params;
  }
  
  if (localSubDomain) {
    const subDomainKeys = Object.keys(localSubDomain);
    if (subDomainKeys.length) {
      subDomainKeys.forEach((key: string) => {
        const obj = localSubDomain[key];
        if (localSubDomain[key]) {
          if (obj.replace) {
            url = url.replace(obj.replace, localSubDomain[key] || '');
          } else {
            const replacePattern = getKeyPatternList(key);
            let found = false;
            replacePattern.forEach((replace) => {
              if (found) return;
              if (new RegExp(replace).test(url)) {
                let value = null;
                if (oauth_data && oauth_data[key]) {
                  value = oauth_data[key]; // prefilled key with oauth data
                } else if (authObj && authObj[key]) {
                  value = authObj[key]; // prefilled key with configured data
                }

                url = url.replace(replace, value);
                found = true;
              }
            });
          }
          localParams[key] = undefined;
        }
      });
    }
  }

  return { url, localParams };
}

async function access({
  provider,
  target,
  payload,
  credsObj,
}: AccessParams): Promise<AccessReturn> {
  const {
    method,
    meta,
    path,
    subdomain,
    domain_params,
    auth,
    headers: defaultHeaders,
    custom_headers: customHeaders,
    payload_type,
  } = target; // intent

  const authDefault = auth;

  const { contentType, api_endpoint } = meta;
  const {
    params = {}, body: originalBody, file,
  } = payload;
  let body = originalBody;
  const { oauth_data = null, authToken: authObj } = credsObj;
  let url = api_endpoint;
  let requestHeaders: { [key: string]: any } = {
    'content-type': 'application/json',
  };

  if (defaultHeaders && Object.keys(defaultHeaders).length) {
    requestHeaders = {
      ...requestHeaders,
      ...defaultHeaders,
    };
  }

  if (customHeaders && Object.keys(customHeaders).length) {
    requestHeaders = {
      ...requestHeaders,
      ...customHeaders,
    };
  }

  if (contentType) {
    requestHeaders['content-type'] = contentType;
  }
  
  // Query Params
  let localParams = { ...params };
  if (path) {
    const pathParamsKeys = Object.keys(path);
    if (params) {
      pathParamsKeys.forEach((pathParamKey: string) => {
        const obj = path[pathParamKey];

        const replace_key = obj.replace_key || obj.replace; // obj.replace is legacy
        if (replace_key && !obj.key_alias) { // to be replaced from query params
          const replace = obj.replace || obj.replace_key;
          if (params[pathParamKey] && replace) {
            url = url.replace(replace, params[pathParamKey]);
          }
        } else {
          const value_key = obj.key_alias || pathParamKey;
          const replacePattern = getKeyPatternList(pathParamKey);
          let found = false;
          replacePattern.forEach((replace) => {
            if (found) return;
            if (new RegExp(replace).test(url)) {
              let value = null;

              if (oauth_data && oauth_data[value_key]) {
                value = oauth_data[value_key]; // prefilled key with oauth data
              } else if (authObj && authObj[value_key]) {
                value = authObj[value_key]; // prefilled key with configured data
              }

              if (params[pathParamKey]) {
                value = params[pathParamKey]; // override incase of passed in query params
              }
              url = url.replace(replace, value);
              found = true;
            }
          });
        }
        localParams[pathParamKey] = undefined;
      });
    }
  }

  // Process subdomain parameters
  const subdomainResult = processSubdomain({
    subdomain,
    domain_params,
    url,
    localParams,
    oauth_data,
    authObj,
  });
  
  url = subdomainResult.url;
  localParams = subdomainResult.localParams;

  // Apply authentication
  const authResult = applyAuthentication({
    authDefault,
    authObj,
    url,
    requestHeaders,
    body,
  });

  const options: { [key: string]: any } = {
    method,
    headers: {},
    ...authResult.options,
  };
  // Update url, requestHeaders, and body
  url = authResult.url;
  requestHeaders = authResult.requestHeaders;
  body = authResult.body;

  // Query Params
  if (localParams && Object.keys(localParams).length) {
    const str = qs.stringify(params);
    if (str) {
      if (/\?/.test(url)) {
        url = `${url}&${str}`;
      } else {
        url = `${url}?${str}`;
      }
    }
  }

  const isUpload = target.type && ['file', 'upload'].includes(target.type.toLowerCase());
  // Body can also be used for GET request but majority of implementation doesn't use it.
  if (METHODS.includes(method.toUpperCase())) {
    if (body && typeof body === 'object') {
      if (isUpload) {
        if (!file) {
          const error: { [key: string]: any } = new Error(
            'File is required for upload.',
          );
          error.code = 422;
          throw error;
        }
        const data = new FormData();
        Object.keys(body).forEach((key) => {
          if (body[key]) {
            data.append(key, body[key]);
          }
        });
        const filePath = `/tmp/${file.originalname}`;
        data.append(file.fieldname, fs.createReadStream(filePath));
        options.data = data;
        options.headers = { ...options.headers, ...data.getHeaders() };
      } else if (payload_type === 'formdata') {
        const data = new FormData();
        Object.keys(body).forEach((key) => {
          if (body[key]) {
            data.append(key, body[key]);
          }
        });
        options.data = data;
        options.headers = { ...options.headers, ...data.getHeaders() };
      } else if (payload_type === 'urlencoded') {
        const data = qs.stringify(body);
        options.data = data;
        options.headers['content-type'] = 'application/x-www-form-urlencoded';
      } else {
        options.data = body;
      }
    } else {
      options.data = {};
    }
  }

  if (prepare[provider] && typeof prepare[provider] === 'function') {
    const [error, signature] = await safePromise(
      prepare[provider](url, { ...options, body: options.data }, authObj),
    );
    if (error) {
      loggerService.error('signing error', error);
    }
    options.headers = signature.headers;
  }

  loggerService.info('API request', url, options);
  // TODO: Refresh access_token for OAUTH2.0 type request
  const {
    error: err,
    data,
    headers,
  }: { [key: string]: any } = await sendRequest(url, options).catch(
    (error) => ({ error }),
  );

  if (err) {
    const { data = { message: err.message }, headers, status } = err.response || err;
    // Note: this was handled for Google OAuth services and for other services it may differ.
    if (status === 401) {
      const tokenObj = await refreshToken({ provider, authObj, credsObj });
      if (tokenObj && tokenObj.credsObj) {
        return access({
          provider, target, payload, credsObj: tokenObj.credsObj,
        });
      }
    }
    loggerService.error(`Request failed for ${provider} API endpoint`, url, data);
    let error: { [key: string]: any } = {};
    if (errorHandler[provider]) {
      error = errorHandler[provider](err, provider);
    } else {
      error = new Error(data.message || `Error received from the ${provider} API`);
    }
    error.code = status;
    if (!error.data) {
      error.data = data;
    }
    error.headers = headers;
    throw error;
  }
  if (file) {
    fs.unlink(`/tmp/${file.originalname}`, () => { });
  }

  const XML_CHECK_REGEX = /^(text|application)\/xml(;.+)?$/;

  const respContentType = headers['content-type'] || headers['Content-Type'];
  let responseData = data;

  if (XML_CHECK_REGEX.test(respContentType)) {
    const [err, jsonData] = await safePromise(parseStringPromise(data));

    if (err) {
      loggerService.error('Error parsing xml response', url);
      const error: { [key: string]: any } = new Error(
        data.message || `Error parsing xml response for ${provider}`,
      );
      error.code = 500;
      error.headers = headers;
      throw error;
    }

    if (jsonData) {
      responseData = {
        xml: data,
        json: jsonData,
      };
    }
  }
  return { data: responseData, headers };
}

export default access;
