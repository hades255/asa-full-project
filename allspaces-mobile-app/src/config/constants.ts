/** Used by Stripe Payment Sheet for redirect-based payment methods (e.g. 3D Secure) on iOS */
export const STRIPE_RETURN_URL = "allspaces://stripe-redirect";

export const ERRORS = {
  email: "Please enter a valid email.",
  password:
    "Please enter a valid password contains at least 8 character",
  confirmPassword: "Password and Confirm Password must be same",
  firstName: "Please enter a valid first name.",
  lastName: "Please enter a valid last name.",
  mobileNumber: "Please enter a valid mobile number.",
  country: "Please select a valid country.",
  dateOfBirth: "Please select a valid date of birth.",
  subject: "Subject is required",
  generalMessage: "Message is required",
  time: "Please select a valid time.",
  date: "Please select a valid date.",
  noOfPersons: "Please enter a valid number of persons.",
  noOfHours: "Please enter a valid number of hours.",
};

export const USER_TYPES = {
  CONCIERGE: "concierge",
};
