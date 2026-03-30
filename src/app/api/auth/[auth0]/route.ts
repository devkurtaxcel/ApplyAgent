import { auth0 } from "@/lib/auth0";

export const GET = (req: Request) => {
  try {
    return auth0.middleware(req);
  } catch (error) {
    console.error('[Auth0 Error]:', error);
    return new Response('Auth0 Configuration Error', { status: 500 });
  }
};
