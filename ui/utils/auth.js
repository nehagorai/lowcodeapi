
export function isLoggedIn() {
  return localStorage.getItem('token');
}
export function setLoggedIn(token) {
  localStorage.setItem('token', token);
}
export function getToken() {
  return localStorage.getItem('token');
}
export function setLoggedInUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('first_time', user.first_time);
}
export function isUserFirstTime() {
  return localStorage.getItem('first_time');
}

export function getLoggedInUser() {
  const data = localStorage.getItem('user');
  return JSON.parse(data);
}

export function resetUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('first_time');
}

export function isAuthenticated() {
  if (isLoggedIn()) {
    return true;
  }
  return false;
}
