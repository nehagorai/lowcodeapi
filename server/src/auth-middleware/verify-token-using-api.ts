import axios from 'axios';
import { safePromise } from '../utilities';
import config from '../config';

const { PROTOCOL, APP_DOMAIN, INTERNAL_ACCESS_KEY } = config;

const url = `${PROTOCOL}://${APP_DOMAIN}/internal/${INTERNAL_ACCESS_KEY}/get-creds`;

export default async ({ api_token, provider }: { [key: string]: any }) => {
  const options = {
    url,
    method: 'POST',
    data: {
      api_token,
      provider,
    },
  };

  const [tokenError, token] = await safePromise(axios(options));
  if (tokenError) {
    throw tokenError;
  }

  if (!token || !token.data) {
    const error: { [key: string]: any } = new Error('Invalid api_token');
    error.code = 403;
    throw error;
  }

  const resp = token.data.res;
  return resp;
};
