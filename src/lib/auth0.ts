import { Auth0Client } from '@auth0/nextjs-auth0/server';

if (!process.env.AUTH0_BASE_URL) {
  console.warn('⚠️ [Auth0] AUTH0_BASE_URL is not defined. Login will fail in production.');
} else if (process.env.NODE_ENV === 'production' && process.env.AUTH0_BASE_URL.includes('localhost')) {
  console.warn('⚠️ [Auth0] AUTH0_BASE_URL is set to localhost in production. This will cause Callback URL mismatch.');
}

/**
 * AUTH0 v4 SDK CLIENT INITIALIZATION
 * 
 * This client serves as the "Identity & Authority Foundation" for ApplyAgent.
 * We use the v4 SDK to manage sessions and facilitate "Authorized Actions"
 * via the Auth0 Token Vault.
 * 
 * Security Note: AUTH0_BASE_URL must be correctly configured in .env.local
 * to ensure that redirect URIs and session cookies are securely handled 
 * across the Next.js 16 Edge runtime.
 */
export const auth0 = new Auth0Client();
