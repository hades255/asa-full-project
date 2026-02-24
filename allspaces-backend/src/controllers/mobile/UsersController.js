import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import crypto from "crypto";
import { hashPassword } from "../../utils/hash.js";
import {
  fetchClerkUserData,
  verifyClerkSession,
} from "../../utils/clerkApi.js";
import { sendVendorInvitationEmail } from "../../services/EmailService.js";

const prisma = new PrismaClient();

// create a Customer From Clerk User ID
export const createCustomerFromClerk = async (req, res) => {
  try {
    const { clerk_user_id } = req.body;

    // Verify session with Clerk API
    const response = await fetchClerkUserData(clerk_user_id);

    console.log("Clerk User Response => ", response);

    if (!response) {
      return res.status(401).json({ error: "User doesn't exist on Clerk" });
    }

    let user = await prisma.user.findFirst({
      where: {
        roles: {
          has: "USER",
        },
        OR: [{ email: response.email_addresses[0].email_address }],
      },
    });

    console.log("User find result => ", user);
    const hashedPassword = await hashPassword("12345678");
    if (!user) {
      console.log("User not exists");
      user = await prisma.user.create({
        data: {
          clerk_user_id,
          email: response.email_addresses[0].email_address,
          first_name: response.first_name,
          last_name: response.last_name,
          password: hashedPassword,
          roles: ["USER"],
        },
      });

      console.log("Created user => ", user);
    } else {
      console.log("Update existing user");
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          clerk_user_id,
          first_name: response.first_name,
          last_name: response.last_name,
          password: hashedPassword,
        },
      });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("Error generating a user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user details for mobile app using session-id
export const getCurrentUserForMobile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with basic info and reviews only
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        roles: true,
        status: true,
        clerk_user_id: true,
        created_at: true,
        confirmed_at: true,
        //  eco_score: true,
        // Include reviews with basic details only
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if first_name and last_name are null
    if (!user.first_name || !user.last_name) {
      console.log(
        "User first_name or last_name is null, fetching from Clerk API"
      );

      const sessionId = req.headers["session-id"];

      if (!sessionId) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Session ID missing" });
      }

      try {
        // First get session details from Clerk
        const sessionResponse = await verifyClerkSession(sessionId);

        console.log("Clerk Session Response => ", sessionResponse);

        if (!sessionResponse || !sessionResponse.user_id) {
          return res.status(401).json({ error: "Invalid session" });
        }

        const clerkUserId = sessionResponse.user_id;

        // Now get user details from Clerk using the user_id
        const userResponse = await fetchClerkUserData(clerkUserId);

        console.log("Clerk User Response => ", userResponse);

        if (userResponse) {
          const clerkUserData = userResponse;

          // Update user in database with data from Clerk
          user = await prisma.user.update({
            where: { id: userId },
            data: {
              first_name: clerkUserData.first_name || user.first_name,
              last_name: clerkUserData.last_name || user.last_name,
              phone:
                clerkUserData.phone_numbers?.[0]?.phone_number || user.phone,
            },
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              roles: true,
              status: true,
              clerk_user_id: true,
              created_at: true,
              confirmed_at: true,
              // eco_score: true,
              reviews: {
                select: {
                  id: true,
                  rating: true,
                  comment: true,
                  createdAt: true,
                },
              },
            },
          });

          console.log("Updated user with Clerk data => ", user);
        }
      } catch (clerkError) {
        console.error("Error fetching user data from Clerk:", clerkError);
        // Continue with existing user data if Clerk API fails
      }
    }

    // Calculate average rating from reviews
    const reviews = user.reviews || [];
    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Prepare response with calculated fields
    const response = {
      ...user,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateVendorPassword = () => {
  const candidate = crypto
    .randomBytes(9)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "");

  if (candidate.length >= 12) {
    return candidate.slice(0, 12);
  }

  const padding = "A9x";
  return (candidate + padding).slice(0, 12);
};

const buildFrontendLink = (relativePath = "") => {
  const base = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.replace(/\/+$/, "")
    : "#";
  const path = relativePath ? `/${relativePath.replace(/^\/+/, "")}` : "";

  return `${base}${path}`;
};

export const createVendorAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Vendor email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Vendor email is required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account already exists for this email address" });
    }

    const plainPassword = generateVendorPassword();
    const hashedPassword = await hashPassword(plainPassword);

    const vendor = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        roles: ["VENDOR"],
        status: "ACTIVE",
        confirmed_at: new Date(),
        refresh_token: "",
      },
      select: {
        id: true,
        email: true,
        roles: true,
        status: true,
        created_at: true,
      },
    });

    const loginLink = buildFrontendLink("login");

    await sendVendorInvitationEmail({
      email: normalizedEmail,
      password: plainPassword,
      link: loginLink,
    });

    return res.status(201).json({
      message: "Vendor account created and invitation email sent",
      user: vendor,
    });
  } catch (error) {
    console.error("Error creating vendor account:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
