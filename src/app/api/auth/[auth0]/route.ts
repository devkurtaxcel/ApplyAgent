import { auth0 } from "@/lib/auth0";

export const GET = (req: Request) => {
  try {
    // If auth0.middleware is missing or the client failed to initialize, it may be due to missing env vars.
    if (!auth0?.middleware) {
      console.error('[Auth0 Critical]: Client was not initialized properly. Check environment variables.');
      return new Response('Auth0 Backend Initialization Failed', { status: 500 });
    }
    return auth0.middleware(req);
  } catch (error) {
    console.error('[Auth0 Handler Error]:', error);
    // Returning a clearer text message for the Hackathon testing.
    return new Response(`[Auth0 Configuration Error]: ${error instanceof Error ? error.message : 'Unknown error during handshake'}`, { status: 500 });
  }
};
