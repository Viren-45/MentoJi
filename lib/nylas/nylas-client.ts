// lib/nylas/nylas-client.ts
import Nylas from "nylas";

// Initialize Nylas client for v3
const nylas = new Nylas({
  apiKey: process.env.NYLAS_CLIENT_SECRET!,
  apiUri: "https://api.us.nylas.com", // Use appropriate region
});

// Configuration constants
export const NYLAS_CONFIG = {
  clientId: process.env.NYLAS_CLIENT_ID!,
  clientSecret: process.env.NYLAS_CLIENT_SECRET!,
  redirectUri: `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/expert/calendar-setup/callback`,
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
};

// Provider configurations for OAuth
export const PROVIDER_CONFIGS = {
  google: {
    provider: "google",
    settings: {
      google_client_id: process.env.GOOGLE_CLIENT_ID,
      google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  apple: {
    provider: "apple",
    settings: {
      apple_client_id: process.env.APPLE_CLIENT_ID,
      apple_client_secret: process.env.APPLE_CLIENT_SECRET,
    },
  },
};

// Helper function to get Nylas client
export const getNylasClient = () => {
  if (!process.env.NYLAS_CLIENT_SECRET) {
    throw new Error("NYLAS_CLIENT_SECRET environment variable is required");
  }
  return nylas;
};

// Helper function to create authorization URL
export const createAuthUrl = (provider: string, expertId: string) => {
  const providerConfig =
    PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];

  if (!providerConfig) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  const redirectUri = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/expert/calendar-setup/callback`;

  console.log("Creating auth URL with redirect URI:", redirectUri);

  const params = new URLSearchParams({
    client_id: NYLAS_CONFIG.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: NYLAS_CONFIG.scopes.join(" "),
    state: JSON.stringify({ provider, expertId }),
    provider: provider,
  });

  const authUrl = `https://api.us.nylas.com/v3/connect/auth?${params.toString()}`;
  console.log("Generated auth URL:", authUrl);

  return authUrl;
};

// Helper function to exchange code for grant (v3 API)
export const exchangeCodeForGrant = async (code: string, provider: string) => {
  try {
    const nylas = getNylasClient();

    const response = await nylas.auth.exchangeCodeForToken({
      clientId: NYLAS_CONFIG.clientId,
      clientSecret: NYLAS_CONFIG.clientSecret,
      redirectUri: NYLAS_CONFIG.redirectUri,
      code,
    });

    return {
      success: true,
      grantId: response.grantId,
      email: response.email,
    };
  } catch (error) {
    console.error("Error exchanging code for grant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Helper function to revoke grant (v3 API)
export const revokeGrant = async (grantId: string) => {
  try {
    const nylas = getNylasClient();
    await nylas.grants.destroy({ grantId });
    return { success: true };
  } catch (error) {
    console.error("Error revoking grant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default nylas;
