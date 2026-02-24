import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import Stripe from "stripe";
import dotenv from "dotenv";

import { hashPassword } from "../../utils/hash.js";
import {
  getHotelsAgainstId,
  getHotelsRates,
  mapAccorHotelsDataSimple,
} from "../../utils/AccorApis.js";

dotenv.config();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGN_IN_KEY;

// Create a stripe customer ID against a Clerk USER
export const createStripeCustomer = async (req, res) => {
  try {
    const { user_id, email, password } = req.body;

    if (!user_id || !email) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer not found against ID!" });
    }

    let user = await prisma.user.findFirst({
      where: {
        roles: {
          has: "USER",
        },
        OR: [{ clerk_user_id: user_id }, { email: email }],
      },
    });

    console.log("User find result => ", user);

    const hashedPassword = await hashPassword(password || "12345678");

    if (!user) {
      console.log("User not exists");

      user = await prisma.user.create({
        data: {
          clerk_user_id: user_id,
          email,
          password: hashedPassword,
          roles: ["USER"],
        },
      });

      console.log("Created user => ", user);
    }

    let stripe_customer_id = user.stripe_customer_id;
    if (!stripe_customer_id) {
      console.log("Generating stripe customer id");

      const customer = await stripe.customers.create({ email });
      stripe_customer_id = customer.id;
    }

    console.log("stripe customer ID => ", stripe_customer_id);

    user = await prisma.user.update({
      where: { id: user.id },
      data: { stripe_customer_id: stripe_customer_id || undefined },
    });

    console.log("updated user => ", user);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error generating stripe customer ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a stripe Setup intent against a stripe customer ID associated with Clerk USER
export const createStripeSetupIntent = async (req, res) => {
  try {
    const { user_id, stripe_customer_id } = req.body;

    if (!user_id || !stripe_customer_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer not found against ID!" });
    }

    let user = await prisma.user.findFirst({
      where: {
        clerk_user_id: user_id,
        roles: {
          has: "USER",
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer not found against ID!" });
    }

    console.log("User find result => ", user);

    // Create an ephemeral key for the Customer
    // Use the same version as the SDK
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: stripe_customer_id },
      { apiVersion: "2025-03-31.basil" }
    );

    console.log("Ephermal Key response => ", ephemeralKey);

    const setupIntent = await stripe.setupIntents.create({
      customer: stripe_customer_id,
      payment_method_types: ["card"],
      usage: "on_session",
    });

    console.log("stripe setup intent => ", setupIntent);

    res
      .status(200)
      .json({ setupIntent, ephemeralKey: ephemeralKey.secret, user });
  } catch (error) {
    console.error("Error generating stripe customer ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a stripe Setup intent against a stripe customer ID associated with Clerk USER
export const updateStripeSetupIntent = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer not found against ID!" });
    }

    let user = await prisma.user.findFirst({
      where: {
        clerk_user_id: user_id,
        roles: {
          has: "USER",
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Customer not found against ID!" });
    }

    console.log("User find result => ", user);

    // Create an ephemeral key for the Customer
    // Use the same version as the SDK
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: user.stripe_customer_id },
      { apiVersion: "2025-03-31.basil" }
    );

    console.log("Ephermal Key response => ", ephemeralKey);

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripe_customer_id,
      payment_method_types: ["card"],
      usage: "on_session",
    });

    console.log("stripe setup intent => ", setupIntent);

    res
      .status(200)
      .json({ setupIntent, ephemeralKey: ephemeralKey.secret, user });
  } catch (error) {
    console.error("Error generating stripe customer ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a stripe Payment intent against a stripe customer ID associated with Clerk USER
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: "Booking ID is required!" });
    }

    // Get the existing booking with all related data
    const booking = await prisma.booking.findUnique({
      where: { id: booking_id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        profile: {
          include: {
            services: {
              include: {
                media: true,
              },
            },
          },
        },
        bookingServices: {
          include: {
            service: {
              include: {
                media: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    // Verify that the booking belongs to the authenticated user
    if (booking.customerId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: This booking doesn't belong to you!" });
    }

    // Create an ephemeral key for the Customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: req.user.stripe_customer_id },
      { apiVersion: "2025-03-31.basil" }
    );

    console.log("Ephemeral Key response => ", ephemeralKey);

    // Calculate amount from booking spend and number of guests
    // If no_of_guests is 0 or undefined, use 1 as default
    const amount = Math.floor(booking.amount);

    console.log("Amount to be paid => ", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 10 ** 2, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
      customer: req.user.stripe_customer_id,
      metadata: {
        booking_id: booking.id,
        user_id: req.user.id,
        customer_id: req.user.id, // Add customer_id for webhook
        amount: amount.toString(),
        source: booking.profile?.source || "SPACE",
      },
    });

    console.log("stripe payment intent => ", paymentIntent);

    res.status(200).json({
      customerEphemeralKeySecret: ephemeralKey.secret,
      customerId: req.user.stripe_customer_id,
      paymentIntentClientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating stripe payment intent:", error);
    res.status(500).json({ message: "Server error" });
  }
};
