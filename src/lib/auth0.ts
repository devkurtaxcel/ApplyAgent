import { Auth0Client } from '@auth0/nextjs-auth0/server';

if (!process.env.APP_BASE_URL) {
  console.warn('⚠️ [Auth0] APP_BASE_URL is not defined. Login will fail in production.');
} else if (process.env.NODE_ENV === 'production' && process.env.APP_BASE_URL.includes('localhost')) {
  console.warn('⚠️ [Auth0] APP_BASE_URL is set to localhost in production. This will cause Callback URL mismatch.');
}

export const auth0 = new Auth0Client();
