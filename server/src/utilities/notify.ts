import axios from 'axios';
import { safePromise, loggerService } from './index';

const {
  INTERNAL_API_ENDPOINT: API_ENDPOINT,
  INTERNAL_API_TOKEN: API_TOKEN,
  INTERNAL_TELEGRAM_CHAT_ID_FOR_ERROR: err_chat_id,
  INTERNAL_TELEGRAM_CHAT_ID: chat_id,
} = process.env;

const getUrl = (api_token: string) => `${API_ENDPOINT}/telegram/bot-token/sendmessage?api_token=${api_token}`;

const notify = async (text: string, error: boolean = false) => {
  const notify_enabled = (error ? err_chat_id : chat_id) && API_ENDPOINT && API_TOKEN;

  if (!notify_enabled) {
    loggerService.info('\n\nTelegram notification disabled, logging', text, '\n\n');
    return;
  }
  const payload = {
    url: getUrl(API_TOKEN),
    method: 'POST',
    data: {
      chat_id,
      parse_mode: 'HTML',
      text,
    },
  };
  const [errorTelegram] = await safePromise(axios(payload));

  if (errorTelegram) {
    console.log('Telegram error', errorTelegram);
  }
};

export { notify };
export default notify;
