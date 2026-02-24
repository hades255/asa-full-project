import axios from "axios";

const clerkApiKey = process.env.CLERK_SECRET_KEY;

/**
 * Fetch user data from Clerk API
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object|null>} - User data from Clerk or null if error
 */
export const fetchClerkUserData = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${clerkApiKey}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching Clerk user data:", error);
    return null;
  }
};

/**
 * Verify session with Clerk API
 * @param {string} sessionId - Session ID from headers
 * @returns {Promise<Object|null>} - Session data from Clerk or null if error
 */
export const verifyClerkSession = async (sessionId) => {
  if (!sessionId) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.clerk.com/v1/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${clerkApiKey}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error verifying Clerk session:", error);
    return null;
  }
};

/**
 * Format Clerk user data to include only required fields
 * @param {Object} clerkUserData - Raw Clerk user data
 * @returns {Object} Formatted Clerk user data
 */
export const formatClerkUserData = (clerkUserData) => {
  if (!clerkUserData) {
    return null;
  }

  // Format email_addresses array
  const formattedEmailAddresses = (clerkUserData.email_addresses || []).map(
    (email) => ({
      object: email.object,
      email_address: email.email_address,
      linked_to: email.linked_to || [],
    })
  );

  // Format phone_numbers array
  const formattedPhoneNumbers = (clerkUserData.phone_numbers || []).map(
    (phone) => ({
      phone_number: phone.phone_number,
    })
  );

  // Format external_accounts array
  const formattedExternalAccounts = (clerkUserData.external_accounts || []).map(
    (account) => ({
      object: account.object,
      id: account.id,
      email_address: account.email_address,
      first_name: account.first_name,
      last_name: account.last_name,
      avatar_url: account.avatar_url,
      image_url: account.image_url,
      username: account.username,
      external_account_id: account.external_account_id,
      google_id: account.google_id,
      given_name: account.given_name,
      family_name: account.family_name,
      picture: account.picture,
    })
  );

  return {
    id: clerkUserData.id,
    object: clerkUserData.object,
    username: clerkUserData.username,
    first_name: clerkUserData.first_name,
    last_name: clerkUserData.last_name,
    image_url: clerkUserData.image_url,
    has_image: clerkUserData.has_image,
    email_addresses: formattedEmailAddresses,
    phone_numbers: formattedPhoneNumbers,
    external_accounts: formattedExternalAccounts,
    unsafe_metadata: clerkUserData.unsafe_metadata || {},
    profile_image_url: clerkUserData.profile_image_url,
  };
};
