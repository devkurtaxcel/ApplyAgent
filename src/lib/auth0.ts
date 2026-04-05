import { Auth0Client } from '@auth0/nextjs-auth0/server';

let _auth0: Auth0Client | null = null;
let _initError: Error | null = null;

// On Vercel, it is critical that AUTH0_BASE_URL matches the deployment URL EXACTLY.
const getBaseUrl = () => {
  if (process.env.AUTH0_BASE_URL) return process.env.AUTH0_BASE_URL.replace(/\/$/, "");
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return 'http://localhost:3000';
};

/**
 * Resilient, Lazy Auth0 Client Initializer.
 * Prevents module-level evaluation crashes on missing/invalid env vars during deployment.
 */
export const getAuth0 = (): Auth0Client => {
  if (_auth0) return _auth0;
  if (_initError) throw _initError;

  try {
    const secret = process.env.AUTH0_SECRET;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;

    // Diagnostic Check: SDK v4 requires these specific variables
    if (!secret || secret.length < 32) {
      throw new Error("AUTH0_SECRET must be at least 32 characters long.");
    }
    if (!clientId) throw new Error("AUTH0_CLIENT_ID is missing.");
    if (!clientSecret) throw new Error("AUTH0_CLIENT_SECRET is missing.");
    if (!issuerBaseUrl) throw new Error("AUTH0_ISSUER_BASE_URL is missing.");

    _auth0 = new Auth0Client({
      appBaseUrl: getBaseUrl(), // SDK v4 uses appBaseUrl internally, but defaults from env
      authorizationParameters: {
        scope: process.env.AUTH0_SCOPE || 'openid profile email',
      },
      // Enable Token Vault / Connected Accounts features
      enableConnectAccountEndpoint: true,
    });

    return _auth0;
  } catch (err) {
    _initError = err instanceof Error ? err : new Error(String(err));
    console.error('[Auth0 Lazy Init Failed]:', _initError.message);
    throw _initError;
  }
};
