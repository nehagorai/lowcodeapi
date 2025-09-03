
export const LOGO_BASE = `/images/providers/logos`;;

export default  ({ APP_ENDPOINT = '', UI_DOMAIN = ''}) => {
    const MOUNT_POINT = '/api/v1';
    const BASE_API  = `${APP_ENDPOINT}${MOUNT_POINT}`;

    return {
        BASE_PATH : '',
        BASE_PATH_FALLBACK : '/',
        
        LOGO_BASE,
        UI_DOMAIN,
        ENDPOINT: APP_ENDPOINT,
        BASE_API,
        APP_CONFIG_API : `${BASE_API}/app`,
        USER_API : `${BASE_API}/user`,
        INTEGRATIONS_API : `${BASE_API}/integrations`,
        PROVIDER_LIST_API : `${BASE_API}/provider-list`,
        METRICS_API : `${BASE_API}/metrics`,
        REQUEST_LOGS_API: `${BASE_API}/request-logs`,
        ACCOUNT_API : `${APP_ENDPOINT}/account`,
    }
}