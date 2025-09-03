import config from '../config';

const {
  APP_DOMAIN, PROTOCOL, API_ENDPOINT: A_E, BASE_PATH = '',
  LOGGING_ENDPOINT: L_E,
} = config;

const { UI_DOMAIN = APP_DOMAIN } = config;
const URL = `${PROTOCOL}://${UI_DOMAIN}`;
const BACK_ENDPOINT = `${PROTOCOL}://${APP_DOMAIN}`;
const LOGGING_ENDPOINT = L_E ? `${PROTOCOL}://${L_E}` : `${PROTOCOL}://${APP_DOMAIN}`;

const API_ENDPOINT = `${PROTOCOL}://${A_E}`;
const endpoint = {
  getOptions: () => ({
    API_ENDPOINT,
    UI_ENDPOINT: URL,
    BACK_ENDPOINT,
    LOGGING_ENDPOINT,
  }),
  getBaseAppendedUrl: (upath: string) => `/${upath}`,
  getLoginUrl: (message: string) => (message ? `${URL}${BASE_PATH}/login?message=${message}` : `${URL}${BASE_PATH}/login`),
  getEmailLoginLink: (token: string, isNew: boolean) => `${BACK_ENDPOINT}/account/action?token=${token}${isNew ? '&type=signup&first=1' : '&type=login'}`,
  redirectToUIPage: (token: string) => `${URL}${BASE_PATH}/login?token=${token}`,
  providerSuccessRedirectUrl: (provider: string) => `${URL}${BASE_PATH}/${provider}?success=1`,
  providerFailureRedirectUrl: (provider: string, message: string) => `${URL}${BASE_PATH}/${provider}?message=${message || `${provider}-oauth-authentication-failed-rejected-or-cancelled`}`,
  sendEmail: (api_token: string) => `${API_ENDPOINT}/email/send?api_token=${api_token}`,
  getChatGPTUrl: (api_token: string) => `${API_ENDPOINT}/openai/v1/chat/completions?api_token=${api_token}`,
};

export default endpoint;
