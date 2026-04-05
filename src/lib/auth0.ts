import { Auth0Client } from '@auth0/nextjs-auth0/server';

// On Vercel, it is critical that AUTH0_BASE_URL matches the deployment URL EXACTLY.
// If it's missing, the SDK will throw a 500. This log will show up in Vercel Deployment Logs.
const requiredVars = ['AUTH0_SECRET', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_ISSUER_BASE_URL', 'AUTH0_BASE_URL'];
requiredVars.forEach(v => {
  if (!process.env[v]) {
    console.warn(`[Auth0-Diagnosis]: Missing ${v}. Please add it to Vercel Environment Variables.`);
  }
});

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE || 'openid profile email',
  },
  // Enable Token Vault / Connected Accounts features
  enableConnectAccountEndpoint: true,
});
