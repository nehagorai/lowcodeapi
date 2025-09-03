import axios from 'axios';
import { getToken, resetUser } from './auth';

function checkStatus(response) {
  const { status, data } = response;
  if (status >= 200 && status < 300) {
    return data;
  }

  console.log(response);
  if ([422].includes(status)) {
    return data;
  }
  if ([401].includes(status)) {
    // resetUser();
    // window.location.reload();
    return response;
  }
  const error = new Error(data.message || response.statusText);
  error.response = response;
  throw error;
}


export default function fetch(url, opts, extra = {}, BASE_PATH = '/') {
  const loginLink = `${BASE_PATH}/login`;
  let options = {};
  if (opts) {
    options = { ...opts };
  }
  if (!options.method) {
    options.method = 'GET';
  }
  // options.credentials = 'include';
  if (!options.headers) {
    if (options.type !== 'file') {
      options.headers = {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
      };
    } else {
      options.headers = {};
    }

    const token = getToken();
    if (token) {
      options.headers['x-auth-token'] = token;
    }
  }

  if (
    options.body &&
    typeof options.body !== 'string' &&
    options.type !== 'file'
  ) {
    // options.body = JSON.stringify(options.body);
    options.data = options.body;
  }

  return axios(url, options)
    .then(checkStatus)
    .catch(error => {
      const { response } = error;
      if(error.message  === 'Network Error') {
        // show pop up here;
        const netError = new Error(error.message);
        netError.code = 500;
        throw netError;
      }

      if (!extra.skip && [401].includes(response.status)) {
        resetUser();
        if (window.location && window.location.reload) {
          window.location.reload();
        }
        return;
      }
      const newError = new Error(response.data.message);
      newError.code = response.status;
      throw newError;
    });
}
