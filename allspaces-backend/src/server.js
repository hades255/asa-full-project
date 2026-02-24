import express, { json, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Capture uncaught errors so we can see what crashes the server
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("[FATAL] Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Set placeholder Clerk keys if missing so @clerk/express import doesn't throw
const hasRealClerkKeys =
  process.env.CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY &&
  process.env.CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  process.env.CLERK_SECRET_KEY.startsWith("sk_");
if (!hasRealClerkKeys) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";
  process.env.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "sk_test_placeholder";
}

import { clerkMiddleware } from "@clerk/express";

// Vendor Panel APIs Routes Configurations
import AuthRoutes from "./routes/AuthRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";

import OrderRoutes from "./routes/OrderRoutes.js";
import UsersRoutes from "./routes/UsersRoutes.js";
import BookingsRoutes from "./routes/BookingsRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import ProfileDetailsRoutes from "./routes/ProfileDetailsRoutes.js";
import ServicesRoutes from "./routes/services.js";
import MediaRoutes from "./routes/MediaRoutes.js";
import NotificationsRoutes from "./routes/NotificationsRoutes.js";
import FaqsContactUsRoutes from "./routes/FaqsContactUsRoutes.js";
import TermsPrivacyRoutes from "./routes/TermsPrivacyRoutes.js";
import SearchRoutes from "./routes/SearchRoutes.js";
import CategoriesRoutes from "./routes/categories.js";
import ReviewRoutes from "./routes/ReviewRoutes.js";

// Mobile APIs Routes Configuration
import { paymentMethodWebhook } from "./controllers/mobile/StripeWebhooksController.js";
import BookingsMobileRoutes from "./routes/mobile/BookingsRoutes.js";
import ProfileMobileRoutes from "./routes/mobile/ProfileRoutes.js";
import PaymentsMobileRoutes from "./routes/mobile/PaymentsRoutes.js";
import WishlistsMobileRoutes from "./routes/mobile/WishlistsRoutes.js";
import ReviewsRoutes from "./routes/mobile/ReviewsRoutes.js";
import NotificationsMobileRoutes from "./routes/mobile/NotificationsRoutes.js";
import UsersMobileRoutes from "./routes/mobile/UsersRoutes.js";
import UserPreferencesRoutes from "./routes/mobile/UserPreferencesRoutes.js";

import swaggerDocs from "./docs/swagger.js";

import { connectToDB } from "./config/db.js";

const PORT = process.env.PORT || 8080;

const app = express();

// Required for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Apply CORS Middleware
const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "session-id",
    "X-Requested-With",
    "ngrok-skip-browser-warning",
  ],
  maxAge: 86400,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// ✅ Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  "/api/mobile/payments/stripe_webhook",
  express.raw({ type: "application/json" }),
  paymentMethodWebhook
);

//middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Clerk auth - only enable when real keys are configured
try {
  if (hasRealClerkKeys) {
    app.use(clerkMiddleware());
  } else {
    console.warn("[server] Clerk keys missing - auth disabled. Add CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to .env");
    app.use((req, res, next) => {
      req.auth = { userId: null };
      next();
    });
  }
} catch (clerkErr) {
  console.warn("[server] Clerk init failed, using stub auth:", clerkErr.message);
  app.use((req, res, next) => {
    req.auth = { userId: null };
    next();
  });
}

// Vendor Panel APIs Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/dashboard", DashboardRoutes);

app.use("/api/orders", OrderRoutes);
app.use("/api/users", UsersRoutes);
app.use("/api/bookings", BookingsRoutes);
app.use("/api/profiles", ProfileRoutes);
app.use("/api/profiles", ProfileDetailsRoutes);
app.use("/api/services", ServicesRoutes);
app.use("/api/categories", CategoriesRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/media", MediaRoutes);
app.use("/api/notifications", NotificationsRoutes);
app.use("/api", FaqsContactUsRoutes);
app.use("/api", TermsPrivacyRoutes);
app.use("/api/search", SearchRoutes);

// Mobile APIs Routes
app.use("/api/mobile/bookings", BookingsMobileRoutes);
app.use("/api/mobile/profiles", ProfileMobileRoutes);
app.use("/api/mobile/payments", PaymentsMobileRoutes);
app.use("/api/mobile/wishlists", WishlistsMobileRoutes);
app.use("/api/mobile/notifications", NotificationsMobileRoutes);
app.use("/api/mobile/reviews", ReviewsRoutes);
app.use("/api/mobile/users", UsersMobileRoutes);
app.use("/api/mobile/preferences", UserPreferencesRoutes);

swaggerDocs(app);

// ✅ Base API Route
app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    docs: "/api-docs",
    message: "Welcome to the Allspaces API",
  });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    docs: "/api-docs",
    api: "/api",
    message: "Allspaces API root",
  });
});

// Serve static files from "uploads" directory
app.use("/uploads", express.static("uploads"));

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
      origin: req.headers.origin,
    });
  }

  // Handle other errors
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

// ✅ 404 Handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      "/api/profiles/me",
      "/api/profiles/search",
      "/api/auth/*",
      "/api-docs",
    ],
  });
});

//listening to server connection
const initializeApp = async () => {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`[server]: server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

initializeApp();
