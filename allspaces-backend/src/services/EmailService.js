import { sendEmail } from "../utils/AwsSes.js";

/**
 * Send registration verification email with OTP
 * @param {string} email - Recipient email
 * @param {string} otp - Verification code
 * @param {boolean} isNewUser - Whether this is a new user or existing user getting new OTP
 * @returns {Promise<void>}
 */
export const sendRegisterEmail = async (email, otp, isNewUser = true) => {
  const subject = isNewUser
    ? "Welcome! Verify Your Account"
    : "Account Verification - New OTP";

  const title = isNewUser ? "Welcome to Spaces!" : "Account Verification";

  const message = isNewUser
    ? "Thank you for registering with us. To complete your registration, please verify your account using the code below:"
    : "Your new verification code is:";

  const footer = isNewUser
    ? "If you didn't create an account with us, please ignore this email."
    : "If you didn't request this code, please ignore this email.";

  const textMessage = isNewUser
    ? `Welcome to Spaces! Your verification code is: ${otp}. Please use this code to verify your account.`
    : `Your verification code is: ${otp}. Please use this code to verify your account.`;

  try {
    await sendEmail({
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">${message}</p>
            
            <div style="background-color: #ffffff; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px; border: 2px solid #e9ecef;">
              <h1 style="color: #007bff; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Please use this code to verify your account. This code will expire in 10 minutes.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              ${footer}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Best regards,<br>
              <strong>Spaces Team</strong>
            </p>
          </div>
        </div>
      `,
      text: textMessage,
    });

    console.log(`Registration OTP sent to ${email}: ${otp}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Failed to send registration email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email with OTP
 * @param {string} email - Recipient email
 * @param {string} otp - Verification code
 * @returns {Promise<void>}
 */
export const sendResetEmail = async (email, otp) => {
  try {
    await sendEmail({
      to: email,
      subject: "Password Reset - Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              You requested to reset your password. Use the verification code below to proceed:
            </p>
            
            <div style="background-color: #ffffff; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px; border: 2px solid #e9ecef;">
              <h1 style="color: #dc3545; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Please use this code to reset your password. This code will expire in 10 minutes.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If you didn't request a password reset, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Best regards,<br>
              <strong>Spaces Team</strong>
            </p>
          </div>
        </div>
      `,
      text: `Your password reset verification code is: ${otp}. Please use this code to reset your password.`,
    });

    console.log(`Password reset OTP sent to ${email}: ${otp}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send general notification email
 * @param {string} email - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @param {string} type - Type of notification (info, warning, success, error)
 * @returns {Promise<void>}
 */
export const sendNotificationEmail = async (
  email,
  subject,
  message,
  type = "info"
) => {
  const colors = {
    info: "#007bff",
    warning: "#ffc107",
    success: "#28a745",
    error: "#dc3545",
  };

  const color = colors[type] || colors.info;

  try {
    await sendEmail({
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: ${color}; margin-bottom: 20px;">${subject}</h2>
            <div style="color: #666; font-size: 16px; line-height: 1.5;">
              ${message}
            </div>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Best regards,<br>
              <strong>Spaces Team</strong>
            </p>
          </div>
        </div>
      `,
      text: message,
    });

    console.log(`Notification email sent to ${email}: ${subject}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return { success: false, error: error.message };
  }
};

export const sendVendorInvitationEmail = async ({ email, password, link }) => {
  const subject = "Welcome to AllSpaces as a Vendor";
  const safeLink = link || "#";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background-color: #f8f9fc;">
      <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to AllSpaces Vendor Portal</h2>
        <p style="color: #344054; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Your vendor account is now active. Use the credentials below to sign in and complete your profile.
        </p>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #475467; font-size: 15px; margin: 0 0 12px 0;"><strong>Email:</strong> ${email}</p>
          <p style="color: #475467; font-size: 15px; margin: 0;"><strong>Temporary Password:</strong> ${password}</p>
        </div>
        <a href="${safeLink}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
          Go to Vendor Portal
        </a>
        <p style="color: #98a2b3; font-size: 13px; margin-top: 24px;">
          Please change your password after your first login for security.
        </p>
      </div>
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
        Best regards,<br/>AllSpaces Team
      </p>
    </div>
  `;

  const text = `Welcome to AllSpaces Vendor Portal.
Email: ${email}
Temporary Password: ${password}
Portal: ${safeLink}

Please change your password after your first login for security.`;

  try {
    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    console.log(`Vendor invitation email sent to ${email}`);
    return { success: true, message: "Vendor invitation email sent" };
  } catch (error) {
    console.error("Failed to send vendor invitation email:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendRegisterEmail,
  sendResetEmail,
  sendNotificationEmail,
  sendVendorInvitationEmail,
};
