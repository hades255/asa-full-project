import { Modal } from "./Modal";
import {
  Star,
  Call,
  Sms,
  Calendar,
  Clock,
  User,
  DollarCircle,
  Instagram,
  Facebook,
  Twitch,
  LinkCircle,
} from "iconsax-react";

export const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const customer = booking.customer || {};
  const service = booking.service || booking.space || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details">
      <div className="space-y-6">
        {/* User Information Section */}
        <div className="bg-semantic-background-backgroundSecondary rounded-xl p-4">
          <h3 className="text-heading4 font-semibold text-semantic-content-contentPrimary mb-4">
            Customer Information
          </h3>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-semantic-background-backgroundTertionary flex items-center justify-center">
              <img
                src={
                  customer.avatar ||
                  customer.profile_picture ||
                  "/default-avatar.png"
                }
                alt="Avatar"
                className="w-14 h-14 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-14 h-14 rounded-full bg-semantic-content-contentTertionary text-white text-lg font-medium items-center justify-center hidden">
                {(customer.name || customer.first_name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-heading4 font-semibold text-semantic-content-contentPrimary">
                  {customer.name || customer.first_name || "Unknown User"}
                </h4>
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-semanticExtensions-content-contentWarning"
                  />
                  <span className="text-body2 font-medium text-semantic-content-contentPrimary">
                    {customer.rating || "4.5"}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 mb-3">
                {customer.email ? (
                  <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                    <Sms size={14} />
                    <span>{customer.email}</span>
                  </div>
                ) : null}

                {customer.phone || customer.phone_number ? (
                  <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                    <Call size={14} />
                    <span>{customer.phone || customer.phone_number}</span>
                  </div>
                ) : null}
              </div>

              {/* Eco Score */}
              {customer.eco_score ? (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-semanticExtensions-background-backgroundPositive flex items-center justify-center">
                    <span className="text-xs font-bold text-white">E</span>
                  </div>
                  <span className="text-body2 font-medium text-semantic-content-contentPrimary">
                    Eco Score: {customer.eco_score}/100
                  </span>
                </div>
              ) : null}

              {/* Social Accounts */}
              <div className="flex items-center gap-2">
                {customer.social_accounts?.instagram && (
                  <a
                    href={customer.social_accounts.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram
                      size={20}
                      className="text-semantic-content-contentTertionary hover:text-pink-500"
                    />
                  </a>
                )}
                {customer.social_accounts?.facebook && (
                  <a
                    href={customer.social_accounts.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook
                      size={20}
                      className="text-semantic-content-contentTertionary hover:text-blue-600"
                    />
                  </a>
                )}
                {customer.social_accounts?.twitter && (
                  <a
                    href={customer.social_accounts.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter
                      size={20}
                      className="text-semantic-content-contentTertionary hover:text-blue-400"
                    />
                  </a>
                )}
                {customer.social_accounts?.linkedin && (
                  <a
                    href={customer.social_accounts.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin
                      size={20}
                      className="text-semantic-content-contentTertionary hover:text-blue-700"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Information Section */}
        <div className="bg-semantic-background-backgroundSecondary rounded-xl p-4">
          <h3 className="text-heading4 font-semibold text-semantic-content-contentPrimary mb-4">
            Booking Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Details */}
            <div className="space-y-3">
              <div>
                <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                  Service Booked
                </label>
                <p className="text-body1 font-semibold text-semantic-content-contentPrimary">
                  {service.name ||
                    booking.service_name ||
                    booking.space_name ||
                    "N/A"}
                </p>
              </div>

              <div>
                <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                  Booking ID
                </label>
                <p className="text-body1 font-semibold text-semantic-content-contentPrimary">
                  {booking.booking_id || booking.id || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                  Status
                </label>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-caption2 font-medium ${
                    booking.status === "CONFIRMED"
                      ? "bg-semanticExtensions-background-backgroundPositive text-white"
                      : booking.status === "PENDING"
                      ? "bg-semanticExtensions-background-backgroundWarning text-white"
                      : booking.status === "CANCELLED"
                      ? "bg-semanticExtensions-background-backgroundNegative text-white"
                      : "bg-semanticExtensions-background-backgroundStateDisabled text-semantic-content-contentTertionary"
                  }`}
                >
                  {booking.status || "Unknown"}
                </span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar
                  size={16}
                  className="text-semantic-content-contentTertionary"
                />
                <div>
                  <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                    Date
                  </label>
                  <p className="text-body1 font-semibold text-semantic-content-contentPrimary">
                    {booking.booking_date ||
                      booking.date ||
                      booking.created_at ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock
                  size={16}
                  className="text-semantic-content-contentTertionary"
                />
                <div>
                  <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                    Duration
                  </label>
                  <p className="text-body1 font-semibold text-semantic-content-contentPrimary">
                    {booking.duration ? `${booking.duration} hours` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User
                  size={16}
                  className="text-semantic-content-contentTertionary"
                />
                <div>
                  <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                    Number of Guests
                  </label>
                  <p className="text-body1 font-semibold text-semantic-content-contentPrimary">
                    {booking.guests || booking.number_of_guests || "1"} guest(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarCircle
                  size={16}
                  className="text-semantic-content-contentTertionary"
                />
                <div>
                  <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                    Minimum Spend
                  </label>
                  <p className="text-body1 font-semibold text-semantic-content-contentPrimary">
                    {booking.min_spend ? `$${booking.min_spend}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {booking.notes && (
            <div className="mt-4 pt-4 border-t border-semantic-background-backgroundTertionary">
              <label className="text-body2 font-medium text-semantic-content-contentTertionary">
                Special Notes
              </label>
              <p className="text-body1 text-semantic-content-contentPrimary mt-1">
                {booking.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
