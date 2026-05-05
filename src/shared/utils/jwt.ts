export interface JwtPayload {
  exp: number; // unix timestamp (seconds)
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

export const isTokenExpiringSoon = (token: string, bufferSeconds = 60) => {
  const decoded = decodeJwt(token);
  if (!decoded?.exp) return false;

  const now = Date.now() / 1000;
  return decoded.exp - now < bufferSeconds;
};