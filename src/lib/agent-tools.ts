import { getAccessTokenFromTokenVault } from "@auth0/ai/TokenVault";

// ═══════════════════════════════════════════════════════
// DEMO MODE — Set to true for demo/video recording
// When enabled, tools return realistic mock tokens instead
// of hitting the real Token Vault.
// ═══════════════════════════════════════════════════════
const DEMO_MODE = true;

const MOCK_TOKENS = {
  gmail: "ya29.a0ARrdaM_xk7Gf8Q2v...",
  linkedin: "AQVkNjM4ZTU2YTRhYWNk...",
};

/**
 * SIMULATED GMAIL TOOL
 * Target Connection: google-oauth2
 */
export async function sendGmailApplication(to: string, subject: string, body: string) {
  if (DEMO_MODE) {
    console.log(`[Agent Tool: Gmail] DEMO MODE - Simulating secure dispatch to ${to}`);
    return {
      success: true,
      service: "Gmail",
      connection: "google-oauth2",
      action: "Send Email",
      details: `Application sent to ${to}`,
      authorized: true,
      tokenPreview: MOCK_TOKENS.gmail,
    };
  }

  try {
    const accessToken = await getAccessTokenFromTokenVault();
    
    console.log(`[Agent Tool: Gmail] Authorized via Token Vault (google-oauth2). Token Length: ${accessToken?.length || 0}`);
    
    return {
      success: true,
      service: "Gmail",
      connection: "google-oauth2",
      action: "Send Email",
      details: `Application sent to ${to}`,
      authorized: true,
      tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : "TOKEN_NOT_FOUND"
    };
  } catch (error) {
    console.error(`[Agent Tool: Gmail] Authorization failed`, error);
    return {
      success: false,
      service: "Gmail",
      connection: "google-oauth2",
      action: "Send Email",
      details: `Failed to retrieve Gmail token: ${error instanceof Error ? error.message : String(error)}`,
      authorized: false
    };
  }
}

/**
 * SIMULATED LINKEDIN TOOL
 * Target Connection: linkedin
 */
export async function updateLinkedInStatus(message: string) {
  if (DEMO_MODE) {
    console.log(`[Agent Tool: LinkedIn] DEMO MODE - Simulating status update`);
    return {
      success: true,
      service: "LinkedIn",
      connection: "linkedin",
      action: "Post Update",
      details: "Profile activity updated with application status",
      authorized: true,
      tokenPreview: MOCK_TOKENS.linkedin,
    };
  }

  try {
    const accessToken = await getAccessTokenFromTokenVault();
    
    console.log(`[Agent Tool: LinkedIn] Authorized via Token Vault (linkedin). Token Length: ${accessToken?.length || 0}`);
    
    return {
      success: true,
      service: "LinkedIn",
      connection: "linkedin",
      action: "Post Update",
      details: "Profile activity updated with application status",
      authorized: true,
      tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : "TOKEN_NOT_FOUND"
    };
  } catch (error) {
    console.error(`[Agent Tool: LinkedIn] Authorization failed`, error);
    return {
      success: false,
      service: "LinkedIn",
      connection: "linkedin",
      action: "Post Update",
      details: `Failed to retrieve LinkedIn token: ${error instanceof Error ? error.message : String(error)}`,
      authorized: false
    };
  }
}
