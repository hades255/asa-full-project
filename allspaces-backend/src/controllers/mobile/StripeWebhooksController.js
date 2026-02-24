import pkg from "@prisma/client";
const { PrismaClient, BookingStatus, PaymentStatus } = pkg;
import Stripe from "stripe";
import dotenv from "dotenv";
import { createNotification } from "../NotificationsController.js";
import {
  getHotelsAgainstId,
  getHotelsRates,
  mapAccorHotelsData,
} from "../../utils/AccorApis.js";
import { hashPassword } from "../../utils/hash.js";

dotenv.config();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGN_IN_KEY;

// A Webhook - Payment Method Webhook
export const paymentMethodWebhook = (req, res) => {
  console.log("In payment webhhoook method...............................");
  console.log("endpointSecret => ", endpointSecret);

  console.log("req headers => ", req.headers);
  console.log("req body => ", req.body);

  const sig = req.headers["stripe-signature"];

  console.log("req signature => ", sig);

  console.log("In payment webhhoook method...............................");

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.error("event => ", event);
  } catch (err) {
    console.error("error occurred => ", err.message);

    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.canceled":
      const paymentIntentCanceled = event.data.object;
      console.log("Payment Intent Cancelled => ", paymentIntentCanceled);
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;
      console.log("Payment Intent Created => ", paymentIntentCreated);
      // Then define and call a function to handle the event payment_intent.created
      break;
    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;
      console.log("Payment Intent Failed => ", paymentIntentPaymentFailed);
      handlePaymentFailure(paymentIntentPaymentFailed);
      break;
    case "payment_intent.processing":
      const paymentIntentProcessing = event.data.object;
      console.log("Payment Intent Processing => ", paymentIntentProcessing);
      // Then define and call a function to handle the event payment_intent.processing
      break;
    case "payment_intent.requires_action":
      const paymentIntentRequiresAction = event.data.object;
      console.log(
        "Payment Intent Requires Action => ",
        paymentIntentRequiresAction
      );
      // Then define and call a function to handle the event payment_intent.requires_action
      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log("Payment Intent Succeeded => ", paymentIntentSucceeded);
      handlePaymentSuccess(paymentIntentSucceeded);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case "setup_intent.canceled":
      const setupIntentCanceled = event.data.object;
      console.log("Setup Intent Cancelled => ", setupIntentCanceled);
      // Then define and call a function to handle the event setup_intent.canceled
      break;
    case "setup_intent.created":
      const setupIntentCreated = event.data.object;
      console.log("Setup Intent Created => ", setupIntentCreated);
      // Then define and call a function to handle the event setup_intent.created
      break;
    case "setup_intent.requires_action":
      const setupIntentRequiresAction = event.data.object;
      console.log("Setup Intent Require Action => ", setupIntentRequiresAction);
      // Then define and call a function to handle the event setup_intent.requires_action
      break;
    case "setup_intent.setup_failed":
      const setupIntentSetupFailed = event.data.object;
      console.log("Setup Intent Failed => ", setupIntentSetupFailed);
      // Then define and call a function to handle the event setup_intent.setup_failed
      break;
    case "setup_intent.succeeded":
      const setupIntentSucceeded = event.data.object;
      console.log("Setup Intent Succeeded => ", setupIntentSucceeded);
      saveUserPaymentMethod(setupIntentSucceeded);
      // Then define and call a function to handle the event setup_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

const saveUserPaymentMethod = async (setup_intent) => {
  console.log("called save user paymemt method ......................");

  let user = await prisma.user.findFirst({
    where: {
      stripe_customer_id: setup_intent.customer,
      roles: {
        has: "USER",
      },
    },
  });

  console.log("user finf against custome id ......................", user);

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { stripe_payment_id: setup_intent.payment_method || undefined },
    });
  }

  console.log("User after updated => ", user);
};

const handlePaymentSuccess = async (payment_intent) => {
  console.log(
    "Payment succeeded - updating payment status......................................",
    payment_intent.metadata
  );

  const { booking_id, user_id, customer_id, source } = payment_intent.metadata;

  if (!booking_id) {
    console.log("Missing booking_id in metadata!");
    return;
  }

  try {
    // Get booking details for notification and eco_score update
    const updatedBooking = await prisma.booking.findUnique({
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

    console.log("Booking details retrieved => ", updatedBooking);

    // Update booking payment status to COMPLETED
    await prisma.booking.update({
      where: { id: booking_id },
      data: {
        payment_status: PaymentStatus.COMPLETED,
      },
    });

    console.log("Booking payment status updated to COMPLETED");

    // Create notification for successful payment
    try {
      await createNotification(
        customer_id,
        booking_id,
        "Booking",
        `Your booking has been confirmed! Payment successful.`
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the process if notification fails
    }

    console.log("Payment processing completed successfully!");
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
};

const handlePaymentFailure = async (payment_intent) => {
  console.log(
    "Payment failed - updating payment status......................................",
    payment_intent.metadata
  );

  const { booking_id, customer_id } = payment_intent.metadata;

  if (!booking_id) {
    console.log("Missing booking_id in metadata!");
    return;
  }

  try {
    // Update booking payment status to FAILED
    await prisma.booking.update({
      where: { id: booking_id },
      data: {
        payment_status: PaymentStatus.FAILED,
        notes: "Payment failed during processing",
      },
    });

    console.log("Booking payment status updated to FAILED");

    // Create notification for failed payment
    try {
      await createNotification(
        customer_id,
        booking_id,
        "Booking",
        `Your booking payment failed. Please try again.`
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the process if notification fails
    }

    console.log("Payment failure processing completed!");
  } catch (error) {
    console.error("Error updating payment status for failure:", error);
  }
};

// setup intent succeeded event object
// {
//   id: 'seti_1R6iPnBOdsKh96U7qNgNdUYj',
//   object: 'setup_intent',
//   application: null,
//   automatic_payment_methods: null,
//   cancellation_reason: null,
//   client_secret: 'seti_1R6iPnBOdsKh96U7qNgNdUYj_secret_S0jtJYas0w8m2NJmFNz76RZshqmq0k6',
//   created: 1742951155,
//   customer: 'cus_Rztv25hEQeVxus',
//   description: null,
//   flow_directions: null,
//   last_setup_error: null,
//   latest_attempt: 'setatt_1R6iQHBOdsKh96U7UKCWJnLq',
//   livemode: false,
//   mandate: null,
//   metadata: {},
//   next_action: null,
//   on_behalf_of: null,
//   payment_method: 'pm_1R6i0BBOdsKh96U7yNMJ1Anc',
//   payment_method_configuration_details: null,
//   payment_method_options: {
//     card: {
//       mandate_options: null,
//       network: null,
//       request_three_d_secure: 'automatic'
//     }
//   },
//   payment_method_types: [ 'card' ],
//   single_use_mandate: null,
//   status: 'succeeded',
//   usage: 'on_session'
// }

// This is the webhook when payment done before booking creation
// Payment Intent Succeeded =>  {
//   id: 'pi_3RAcfZCujIr63hMn1PcFYUck',
//   object: 'payment_intent',
//   amount: 7200,
//   amount_capturable: 0,
//   amount_details: { tip: {} },
//   amount_received: 7200,
//   application: null,
//   application_fee_amount: null,
//   automatic_payment_methods: null,
//   canceled_at: null,
//   cancellation_reason: null,
//   capture_method: 'automatic_async',
//   client_secret: 'pi_3RAcfZCujIr63hMn1PcFYUck_secret_Qb4RCsjoehtHrp5ivT3yoouoF',
//   confirmation_method: 'automatic',
//   created: 1743882381,
//   currency: 'usd',
//   customer: 'cus_S4lamrnvL0YFle',
//   description: null,
//   last_payment_error: null,
//   latest_charge: 'ch_3RAcfZCujIr63hMn1068KfTr',
//   livemode: false,
//   metadata: {
//     profile_id: '5755d5e2-5b77-400b-914a-cfa5993efa98',
//     check_in: '2025-04-05T19:37:33.000Z',
//     user_id: 'user_2vK2evfKqnILhhyxVwqFJ5CRsA8',
//     time: 'Sun Apr 06 2025 00:37:47 GMT+0500',
//     no_of_guests: '2'
//   },
//   next_action: null,
//   on_behalf_of: null,
//   payment_method: 'pm_1RAcNOCujIr63hMnNIkGDgTy',
//   payment_method_configuration_details: null,
//   payment_method_options: {
//     card: {
//       installments: null,
//       mandate_options: null,
//       network: null,
//       request_three_d_secure: 'automatic'
//     }
//   },
//   payment_method_types: [ 'card' ],
//   processing: null,
//   receipt_email: null,
//   review: null,
//   setup_future_usage: null,
//   shipping: null,
//   source: null,
//   statement_descriptor: null,
//   statement_descriptor_suffix: null,
//   status: 'succeeded',
//   transfer_data: null,
//   transfer_group: null
// }
