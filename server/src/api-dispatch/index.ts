/**
 * API Dispatch Module
 * 
 * This module handles the core functionality for dispatching API requests to various providers.
 * It manages authentication, URL parameter substitution, request preparation, and response handling.
 * 
 * Key responsibilities:
 * - Apply different authentication methods (headers, basic auth, query params, path params, body)
 * - Process URL parameter substitution for path and subdomain parameters
 * - Handle different payload types (JSON, form data, URL encoded, file uploads)
 * - Manage OAuth token refresh on 401 errors
 * - Parse XML responses to JSON format
 * - Provide comprehensive error handling
 */

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

// HTTP methods that typically include a request body
const METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

// Common URL parameter patterns used for substitution
const getKeyPatternList = (key: string) => [`{${key}}`, `:${key}`, `<${key}>`];

/**
 * Prepares authentication for API dispatch based on the configured authentication method.
 * Supports multiple authentication types: headers, basic auth, query params, path params, and body params.
 * 
 * @param authDefault - Authentication configuration object
 * @param authObj - Authentication credentials object containing tokens/keys
 * @param url - The API endpoint URL
 * @param requestHeaders - Request headers object to be modified
 * @param body - Request body object to be modified
 * @returns AuthResult containing modified url, options, headers, and body
 */
function prepareAuthForDispatch({
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

  // Handle header-based authentication (e.g., Authorization: Bearer token)
  if (authDefault && authDefault.header) {
    // Converting object to array of objects to support multiple custom headers
    const headerArray = Array.isArray(authDefault.header)
      ? authDefault.header : [authDefault.header];

    headerArray.forEach((header: any) => {
      const headerName = header.headerName ? header.headerName.trim() : '';

      if (headerName) {
        const headerValue = header.headerValue ? header.headerValue.trim() : '';
        if (headerValue) {
          // Combine header value with auth token (e.g., "Bearer " + token)
          requestHeaders[headerName] = `${headerValue} ${authObj[header.authKey]}`;
        } else {
          // Use auth token directly as header value
          requestHeaders[headerName] = authObj[header.authKey];
        }
      }
    });
    options.headers = requestHeaders;
  } 
  // Handle basic authentication (username/password)
  else if (authDefault && authDefault.basicauth) {
    options.auth = {
      username:
        authObj[authDefault.basicauth.username]
        || authDefault.basicauth.username, // fallback for mailgun compatibility
      password: authObj[authDefault.basicauth.password],
    };
  } 
  // Handle query parameter authentication (legacy format)
  else if (authDefault && authDefault.query) {
    const { query = [] } = authDefault;
    query.forEach((key: string, index: number) => {
      if (authObj[key]) {
        // Build query string with proper separators
        if (index === 0) {
          url = `${url}?${key}=${authObj[key]}`;
        } else if (query.length !== index + 1) {
          url = `${url}&${key}=${authObj[key]}`;
        } else {
          url = `${url}&${key}=${authObj[key]}`;
        }
      }
    });
  } 
  // Handle mapped query parameter authentication (e.g., Facebook OAuth)
  else if (authDefault && authDefault.queryMap) {
    const { queryMap = {} } = authDefault;
    const keys = Object.keys(queryMap);
    keys.forEach((key: string, index: number) => {
      if (authObj[queryMap[key]]) {
        // Determine if URL already has query parameters
        if (index === 0) {
          const fragment = /\?/.test(url) ? '&' : '?';
          url = `${url}${fragment}${key}=${authObj[queryMap[key]]}`;
        } else if (keys.length !== index + 1) {
          url = `${url}&${key}=${authObj[queryMap[key]]}`;
        } else {
          url = `${url}&${key}=${authObj[queryMap[key]]}`;
        }
      }
    });
  } 
  // Handle path parameter authentication (URL path substitution)
  else if (authDefault && authDefault.path) {
    const { path = {} } = authDefault;
    const keys = Object.keys(path);
    keys.forEach((key) => {
      const value = authObj[path[key]];
      if (value) {
        const replacePattern = getKeyPatternList(key);
        let found = false;
        // Replace the first matching pattern in the URL
        replacePattern.forEach((replace) => {
          if (found) return;
          if (new RegExp(replace).test(url)) {
            url = url.replace(replace, value);
            found = true;
          }
        });
      }
    });
  } 
  // Handle body parameter authentication (request body substitution)
  else if (authDefault && authDefault.body) {
    const { body: bodyMap } = authDefault;
    const keys = Object.keys(bodyMap);
    keys.forEach((key: string) => {
      body[key] = authObj[bodyMap[key]];
    });
  } 
  // No supported authentication method found
  else {
    const error: { [key: string]: any } = new Error(
      'Authentication mode not implemented.',
    );
    error.code = 401;
    throw error;
  }

  return { url, options, requestHeaders, body };
}

/**
 * Processes subdomain parameters and performs URL substitution.
 * Handles both direct replacement patterns and parameter-based substitution.
 * 
 * @param subdomain - Subdomain configuration object
 * @param url - The API endpoint URL to be modified
 * @param localParams - Local parameters object (modified to remove processed params)
 * @param oauth_data - OAuth data object for parameter values
 * @param authObj - Authentication object for parameter values
 * @returns SubdomainResult containing modified URL and cleaned parameters
 */
function getSubdomainEndpoint({
  subdomain,
  url,
  localParams,
  oauth_data,
  authObj,
}: ProcessSubdomainParams): SubdomainResult {
  let localSubDomain: { [key: string]: any } = {};
  if (subdomain && Object.keys(subdomain).length) {
    localSubDomain = subdomain;
  }
  
  if (localSubDomain) {
    const subDomainKeys = Object.keys(localSubDomain);
    if (subDomainKeys.length) {
      subDomainKeys.forEach((key: string) => {
        const obj = localSubDomain[key];
        if (localSubDomain[key]) {
          // Handle direct replacement pattern (e.g., specific string replacement)
          if (obj.replace) {
            url = url.replace(obj.replace, localSubDomain[key] || '');
          } 
          // Handle parameter-based substitution using common patterns
          else {
            const replacePattern = getKeyPatternList(key);
            let found = false;
            replacePattern.forEach((replace) => {
              if (found) return;
              if (new RegExp(replace).test(url)) {
                let value = null;
                // Priority: OAuth data > Auth object > undefined
                if (oauth_data && oauth_data[key]) {
                  value = oauth_data[key]; // Use OAuth data if available
                } else if (authObj && authObj[key]) {
                  value = authObj[key]; // Fallback to configured auth data
                }

                url = url.replace(replace, value);
                found = true;
              }
            });
          }
          // Remove processed parameter from local params to avoid duplication
          localParams[key] = undefined;
        }
      });
    }
  }

  return { url, localParams: { ...localParams } };
}

/**
 * Main function that dispatches API requests to various providers.
 * Handles the complete request lifecycle including authentication, parameter substitution,
 * request preparation, execution, and response processing.
 * 
 * @param provider - The API provider name (e.g., 'github', 'slack', 'google')
 * @param target - The API endpoint configuration (intent)
 * @param payload - Request payload containing params, body, and file data
 * @param credsObj - Credentials object containing OAuth data and auth tokens
 * @returns Promise<AccessReturn> containing response data and headers
 */
async function dispatchRequest({
  provider,
  target,
  payload,
  credsObj,
}: AccessParams): Promise<AccessReturn> {
  // Extract configuration from the target intent
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

  // Extract metadata and payload components
  const { contentType, api_endpoint } = meta;
  const {
    params = {}, body: originalBody, file,
  } = payload;
  let body = originalBody;
  const { oauth_data = null, authToken: authObj } = credsObj;
  let url = api_endpoint;
  
  // Initialize request headers with default content type
  let requestHeaders: { [key: string]: any } = {
    'content-type': 'application/json',
  };

  // Apply default headers from configuration
  if (defaultHeaders && Object.keys(defaultHeaders).length) {
    requestHeaders = {
      ...requestHeaders,
      ...defaultHeaders,
    };
  }

  // Apply custom headers from request
  if (customHeaders && Object.keys(customHeaders).length) {
    requestHeaders = {
      ...requestHeaders,
      ...customHeaders,
    };
  }

  // Override content type if specified in metadata
  if (contentType) {
    requestHeaders['content-type'] = contentType;
  }
  
  // Process path parameters and URL substitution
  let localParams = { ...params };
  if (path) {
    const pathParamsKeys = Object.keys(path);
    if (params) {
      pathParamsKeys.forEach((pathParamKey: string) => {
        const obj = path[pathParamKey];

        // Handle direct replacement (legacy support)
        const replace_key = obj.replace_key || obj.replace; // obj.replace is legacy
        if (replace_key && !obj.key_alias) { // to be replaced from query params
          const replace = obj.replace || obj.replace_key;
          if (params[pathParamKey] && replace) {
            url = url.replace(replace, params[pathParamKey]);
          }
        } 
        // Handle parameter-based substitution
        else {
          const value_key = obj.key_alias || pathParamKey;
          const replacePattern = getKeyPatternList(pathParamKey);
          let found = false;
          replacePattern.forEach((replace) => {
            if (found) return;
            if (new RegExp(replace).test(url)) {
              let value = null;

              // Priority: OAuth data > Auth object > Request params
              if (oauth_data && oauth_data[value_key]) {
                value = oauth_data[value_key]; // Use OAuth data if available
              } else if (authObj && authObj[value_key]) {
                value = authObj[value_key]; // Fallback to configured auth data
              }

              if (params[pathParamKey]) {
                value = params[pathParamKey]; // Override with request params if provided
              }
              url = url.replace(replace, value);
              found = true;
            }
          });
        }
        // Remove processed parameter to avoid duplication in query string
        localParams[pathParamKey] = undefined;
      });
    }
  }

  // Process subdomain parameters (similar to path params but for subdomain substitution)
  const localSubdomainObj = subdomain || domain_params || null;
  if (localSubdomainObj && Object.keys(localSubdomainObj).length) {
    const subdomainResult = getSubdomainEndpoint({
      subdomain: localSubdomainObj,
      url,
      localParams,
      oauth_data,
      authObj,
    });
    
    url = subdomainResult.url;
    localParams = subdomainResult.localParams;
  }
  
  // Apply authentication based on configured method
  const authResult = prepareAuthForDispatch({
    authDefault,
    authObj,
    url,
    requestHeaders,
    body,
  });

  // Build request options
  const options: { [key: string]: any } = {
    method,
    headers: {},
    ...authResult.options,
  };
  
  // Update url, requestHeaders, and body from authentication result
  url = authResult.url;
  requestHeaders = authResult.requestHeaders;
  body = authResult.body;

  // Add remaining query parameters to URL
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

  // Determine if this is a file upload request
  const isUpload = target.type && ['file', 'upload'].includes(target.type.toLowerCase());
  
  // Process request body for methods that support it
  if (METHODS.includes(method.toUpperCase())) {
    if (body && typeof body === 'object') {
      // Handle file upload requests
      if (isUpload) {
        if (!file) {
          const error: { [key: string]: any } = new Error(
            'File is required for upload.',
          );
          error.code = 422;
          throw error;
        }
        // Create FormData for file upload
        const data = new FormData();
        Object.keys(body).forEach((key) => {
          if (body[key]) {
            data.append(key, body[key]);
          }
        });
        // Add file to FormData
        const filePath = `/tmp/${file.originalname}`;
        data.append(file.fieldname, fs.createReadStream(filePath));
        options.data = data;
        options.headers = { ...options.headers, ...data.getHeaders() };
      } 
      // Handle form data requests
      else if (payload_type === 'formdata') {
        const data = new FormData();
        Object.keys(body).forEach((key) => {
          if (body[key]) {
            data.append(key, body[key]);
          }
        });
        options.data = data;
        options.headers = { ...options.headers, ...data.getHeaders() };
      } 
      // Handle URL-encoded form data
      else if (payload_type === 'urlencoded') {
        const data = qs.stringify(body);
        options.data = data;
        options.headers['content-type'] = 'application/x-www-form-urlencoded';
      } 
      // Default to JSON body
      else {
        options.data = body;
      }
    } else {
      options.data = {};
    }
  }

  // Apply provider-specific request preparation (e.g., request signing)
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
  
  // Execute the API request
  const {
    error: err,
    data,
    headers,
  }: { [key: string]: any } = await sendRequest(url, options).catch(
    (error) => ({ error }),
  );

  // Handle request errors
  if (err) {
    const { data = { message: err.message }, headers, status } = err.response || err;
    
    // Handle 401 Unauthorized - attempt token refresh for OAuth2
    if (status === 401) {
      const tokenObj = await refreshToken({ provider, authObj, credsObj });
      if (tokenObj && tokenObj.credsObj) {
        // Retry request with refreshed token
        return dispatchRequest({
          provider, target, payload, credsObj: tokenObj.credsObj,
        });
      }
    }
    
    loggerService.error(`Request failed for ${provider} API endpoint`, url, data);
    let error: { [key: string]: any } = {};
    
    // Use provider-specific error handler if available
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
  
  // Clean up uploaded file
  if (file) {
    fs.unlink(`/tmp/${file.originalname}`, () => { });
  }

  // Process XML responses
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
      // Return both original XML and parsed JSON
      responseData = {
        xml: data,
        json: jsonData,
      };
    }
  }
  
  return { data: responseData, headers };
}

export default dispatchRequest;
