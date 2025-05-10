export function setAuthCookie(accessToken: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  const cookieValue = JSON.stringify({ access_token: accessToken, expires_at: expiresAt });
  document.cookie = `auth=${cookieValue}; expires=${new Date(expiresAt * 1000).toUTCString()}; path=/`;
}

export function getAuthCookie() {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='));
  if (!authCookie) return null;

  try {
    return JSON.parse(authCookie.split('=')[1]);
  } catch {
    return null;
  }
}
