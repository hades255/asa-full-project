import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";
import { sendRegisterEmail, sendResetEmail } from "../services/EmailService.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { first_name, last_name, phone, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // If user exists and is confirmed, return error
    if (existingUser && existingUser.confirmed_at) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      // User exists but not confirmed, generate new OTP
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          refresh_token: otp,
        },
      });

      // // Send OTP via email
      const emailResult = await sendRegisterEmail(email, otp, false);
      if (!emailResult.success) {
        console.error("Failed to send OTP email:", emailResult.error);
        // Continue with registration even if email fails
      }

      console.log("Updated user with new OTP => ", user);
      res.status(200).json({ message: "New OTP generated successfully", otp });
    } else {
      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          refresh_token: otp,
        },
      });

      const emailResult = await sendRegisterEmail(email, otp, true);
      if (!emailResult.success) {
        console.error("Failed to send OTP email:", emailResult.error);
        // Continue with registration even if email fails
      }

      console.log("Created new user => ", user);
      res.status(201).json({ message: "User registered successfully", otp });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not exists" });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid || user.roles.includes("USER")) {
      return res.status(400).json({ message: "Email or password incorrect" });
    }

    if (user.status != "ACTIVE") {
      return res.status(400).json({
        message: "User is temporary blocked, please contact with support team.",
      });
    }

    console.log("user record => ", user);
    console.log("!user.confirmed_at => ", !user.confirmed_at);

    if (!user.confirmed_at) {
      return res
        .status(400)
        .json({ message: "Please verify your account first!" });
    }

    const accessToken = generateToken(user);
    console.log("accessToken => ", accessToken);
    const refreshToken = generateRefreshToken(user);
    console.log("refreshToken => ", refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    res.json({
      accessToken,
      refreshToken,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      isAdminView: !user.parent_id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Forgot Password - Generate OTP or Reset Token
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    await prisma.user.update({
      where: { email },
      data: { refresh_token: otp },
    });

    // Send OTP via email
    const emailResult = await sendResetEmail(email, otp);
    if (!emailResult.success) {
      console.error(
        "Failed to send password reset OTP email:",
        emailResult.error
      );
      // Continue even if email fails
    }

    res.json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!newPassword)
      return res.status(404).json({ message: "Invalid Password!" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp, type } = req.body;
  try {
    if (!["account-confirm", "reset-password"].includes(type)) {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.refresh_token !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    await prisma.user.update({
      where: { email },
      data: {
        refresh_token: "",
        confirmed_at:
          type == "account-confirm" ? new Date() : user.confirmed_at,
      },
    });

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const user = await prisma.user.findFirst({
      where: { refresh_token: refreshToken },
    });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = generateToken(user);

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Sign Out
export const signOut = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const user = await prisma.user.findFirst({
      where: { refresh_token: refreshToken },
    });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: "" },
    });

    res.json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Change Password (requires authentication)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate request body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Check if current and new password are same
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
        first_name: true,
        last_name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
