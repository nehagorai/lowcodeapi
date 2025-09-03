import axios from 'axios';

import endpoint from './endpoint';
import loggerService from './logger';
import config from '../config';

const { INTERNAL_ACCESS_KEY } = config;
const { LOGGING_ENDPOINT } = endpoint.getOptions();

export default async (obj: any) => {
  const url = `${LOGGING_ENDPOINT}/internal/${INTERNAL_ACCESS_KEY}/log-request`;

  try {
    await axios({
      url,
      method: 'POST',
      data: {
        ...obj,
      },
    });
  } catch (e) {
    loggerService.error(url, e);
  }
};
