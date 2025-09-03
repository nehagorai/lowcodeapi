import { resetUser } from './auth';

const onLogout = (ACCOUNT_API = '') => async () => {
  try {
    resetUser();
    const resp = await fetch(`${ACCOUNT_API}/logout`);
    const data = await resp.json();
    if (data && data.res) {
      window.location.href = data.res.redirect;
    } else {
      window.location.href = '/';
    }
  } catch (e) {
    console.log('Logout API error', e);
  }
};

export default onLogout;
