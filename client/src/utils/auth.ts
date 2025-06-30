export const getToken = () => localStorage.getItem('token');

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split('.');
    const decoded = JSON.parse(atob(payloadBase64));
    const expiry = decoded.exp;
    return expiry * 1000 > Date.now();
  } catch (err) {
    return false;
  }
};
