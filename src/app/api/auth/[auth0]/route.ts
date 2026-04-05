import { getAuth0 } from "@/lib/auth0";

export const GET = (req: Request) => {
  try {
    const auth0 = getAuth0();
    return auth0.middleware(req);
  } catch (error) {
    console.error('[Auth0 Error]:', error);
    // Returning a clearer error during testing for the Hackathon.
    return new Response(`[Auth0 Configuration Error]: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
};
