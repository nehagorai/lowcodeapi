import { LOGO_BASE } from './constants';

const getLogoUrl = (item, { logo_url = LOGO_BASE, full_url, } = { }) => {
    const name = (/\.svg/).test(item) ? item : `${item}.svg`;
    return full_url ? full_url : `${logo_url}/${name}`;
}

export default getLogoUrl;