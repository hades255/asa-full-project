import {
  BOOKING_API_ROUTES,
  useGetBookingById,
  useUpdateBookingsStatus,
  useCreateCustomerReview,
  useCancelBooking,
} from "../../api/bookingsApis";
import { Loader } from "../../components/Loader";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  DollarCircle,
  Star1,
  CallCalling,
  Sms,
  Global,
  TickCircle,
  CloseCircle,
} from "iconsax-react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { showToast } from "../../utils/logs";
import { CancelBookingModal } from "../../components/CancelBookingModal";
import QRCode from "react-qr-code";
import AppButton from "../../components/new/AppButton";
import { useQueryClient } from "@tanstack/react-query";
import { RatingModal } from "../../components/RatingModal";

export const BookingDetails = () => {
  const navigate = useNavigate();
  const { id: bookingId } = useParams();
  const [cancelModal, setCancelModal] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: booking, isPending } = useGetBookingById(bookingId);
  const { mutateAsync: updateBookingStatus, isPending: updateStatusLoading } =
    useUpdateBookingsStatus();

  const { mutateAsync: createCustomerReview, isPending: isSubmittingReview } =
    useCreateCustomerReview();

  const { mutateAsync: cancelBooking, isPending: cancelBookingLoading } =
    useCancelBooking();

  console.log("booking", booking);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-[#FDD835]"; // Yellow
      case "CONFIRMED":
      case "APPROVED":
        return "bg-[#0E8345]"; // Green
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return "bg-[#F9A825]"; // Orange
      case "COMPLETED":
        return "bg-[#FFEB3B]"; // Light Yellow
      case "CANCELLED":
      case "REJECTED":
        return "bg-[#DE1135]"; // Red
      default:
        return "bg-semanticExtensions-background-backgroundStateDisabled";
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
      case "APPROVED":
        return "Confirmed";
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
      case "REJECTED":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const onMarkAsConfirmed = async () => {
    try {
      await updateBookingStatus({
        bookingId: booking.id,
        status: "CONFIRMED",
      });
      queryClient.invalidateQueries({
        queryKey: [BOOKING_API_ROUTES.BOOKINGS],
      });
      showToast("Booking confirmed successfully", "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const onMarkAsCompleted = async () => {
    try {
      await updateBookingStatus({
        bookingId: booking.id,
        status: "COMPLETED",
      });
      showToast("Booking marked as completed", "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const onCancelBooking = async (cancellationReason) => {
    try {
      await cancelBooking({
        bookingId: booking.id,
        cancellationReason: cancellationReason,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [BOOKING_API_ROUTES.BOOKINGS],
      });
      queryClient.invalidateQueries({
        queryKey: [BOOKING_API_ROUTES.BOOKINGS, bookingId],
      });
      
      showToast("Booking cancelled successfully", "success");
      setCancelModal(false);
    } catch (error) {
      showToast("Failed to cancel booking", "error");
    }
  };

  const onSubmitRating = async (rating, comment) => {
    try {
      await createCustomerReview({
        bookingId: booking.id,
        rating,
        comment,
      });

      showToast("Rating submitted successfully", "success");
      setRatingModal(false);

      // Refresh booking data
      queryClient.invalidateQueries({
        queryKey: [BOOKING_API_ROUTES.BOOKINGS, bookingId],
      });
    } catch (error) {
      showToast("Failed to submit rating", "error");
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-full flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full h-full flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-body1 text-semantic-content-contentTertionary">
              Booking not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const customer = booking.customer || {};
  const service = booking.bookingServices?.[0] || {};

  return (
    <div className="w-full h-full flex flex-1 flex-col overflow-y-auto">
      {/* Header with Back Button - Outside Container */}
      <div className="flex items-center gap-4 mb-6 px-4 sm:px-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-semantic-background-backgroundSecondary flex items-center justify-center hover:bg-semantic-background-backgroundTertionary transition-colors"
        >
          <ArrowLeft
            size={20}
            className="text-semantic-content-contentPrimary"
          />
        </button>
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">
          Booking Details
        </h1>
      </div>

      {/* Single White Container */}
      <div className="bg-semantic-background-backgroundPrimary rounded-2xl shadow-md p-6">
        {/* Booking Section */}
        <div className="mb-8">
          <h2 className="text-heading3 font-semibold text-semantic-content-contentPrimary mb-4">
            Booking Information
          </h2>
          <div className="border-b border-semantic-border-borderPrimary pb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-2">
                  <QRCode
                    value={booking.id}
                    size={120}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-body2 text-semantic-content-contentTertionary mb-1">
                      Booking ID
                    </p>
                    <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                      #{booking.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-body2 text-semantic-content-contentTertionary mb-1">
                      Duration
                    </p>
                    <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                      {booking.duration || 0} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-body2 text-semantic-content-contentTertionary mb-1">
                      Guests
                    </p>
                    <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                      {booking.no_of_guests || 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-body2 text-semantic-content-contentTertionary mb-1">
                      Min Spend
                    </p>
                    <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                      ${service.minSpend || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-body2 text-semantic-content-contentTertionary mb-1">
                      Date & Time
                    </p>
                    <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                      {moment(booking.check_in).format("DD/MM/YYYY hh:mm A")}
                    </p>
                  </div>
                  {booking.cancellationReason && (
                    <div className="md:col-span-2">
                      <p className="text-body2 text-semantic-content-contentTertionary mb-1">
                        Cancellation Reason
                      </p>
                      <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                        {booking.cancellationReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full ${getStatusColor(
                        booking.status
                      )} text-semantic-content-contentInversePrimary text-body1 font-medium py-2 px-4`}
                    >
                      {getStatusDisplayName(booking.status)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {booking.status?.toUpperCase() === "PENDING" && (
                      <>
                        <button
                          onClick={onMarkAsConfirmed}
                          disabled={updateStatusLoading}
                          className="flex items-center gap-2 bg-semantic-color-colorSuccess text-white px-4 py-2 rounded-lg text-body2 font-medium hover:bg-semantic-color-colorSuccessHover transition-colors disabled:opacity-50"
                        >
                          <TickCircle size={16} />
                          Mark as Confirmed
                        </button>
                        <button
                          onClick={() => setCancelModal(true)}
                          className="flex items-center gap-2 bg-semantic-color-colorError text-white px-4 py-2 rounded-lg text-body2 font-medium hover:bg-semantic-color-colorErrorHover transition-colors"
                        >
                          <CloseCircle size={16} />
                          Cancel
                        </button>
                      </>
                    )}
                    {(booking.status?.toUpperCase() === "CONFIRMED" ||
                      booking.status?.toUpperCase() === "APPROVED") && (
                      <button
                        onClick={() => setCancelModal(true)}
                        className="flex items-center gap-2 bg-semantic-color-colorError text-white px-4 py-2 rounded-lg text-body2 font-medium hover:bg-semantic-color-colorErrorHover transition-colors"
                      >
                        <CloseCircle size={16} />
                        Cancel
                      </button>
                    )}
                    {booking.status?.toUpperCase() === "IN_PROGRESS" && (
                      <AppButton
                        className={`w-[300px]`}
                        title={`Mark as completed`}
                        onClick={onMarkAsCompleted}
                        disabled={updateStatusLoading}
                      />
                    )}
                    {booking.status?.toUpperCase() === "COMPLETED" &&
                      !booking.reviews.length && (
                        <AppButton
                          className={`w-[264px]`}
                          title={`Give Rating`}
                          onClick={() => setRatingModal(true)}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="mb-8">
          <h2 className="text-heading3 font-semibold text-semantic-content-contentPrimary mb-4">
            Customer Information
          </h2>
          <div className="border-b border-semantic-border-borderPrimary pb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-semantic-background-backgroundSecondary flex items-center justify-center flex-shrink-0">
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
              <div className="flex-1">
                <h3 className="text-heading4 font-semibold text-semantic-content-contentPrimary mb-2">
                  {customer.first_name && customer.last_name
                    ? `${customer.first_name} ${customer.last_name}`
                    : customer.name || customer.first_name || "Unknown User"}
                </h3>
                <div className="space-y-2">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                      <Sms size={16} />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {(customer.phone || customer.phone_number) && (
                    <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                      <CallCalling size={16} />
                      <span>{customer.phone || customer.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                    <Global
                      size={16}
                      className="text-semanticExtensions-content-contentAccent"
                    />
                    <span>Google</span>
                  </div>
                  {customer.eco_score && (
                    <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                      <span className="w-4 h-4 rounded-full bg-green-500"></span>
                      <span>Eco Score: {customer.eco_score}</span>
                    </div>
                  )}
                  {customer.rating && (
                    <div className="flex items-center gap-2 text-body2 text-semantic-content-contentSecondary">
                      <Star1 size={16} className="text-yellow-500" />
                      <span>Rating: {customer.rating}/5</span>
                      <span className="text-semantic-content-contentTertionary">
                        ({customer.review_count || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Section */}
        <div className="mb-8">
          <h2 className="text-heading3 font-semibold text-semantic-content-contentPrimary mb-4">
            Service Information
          </h2>
          <div className="border-b border-semantic-border-borderPrimary pb-6">
            <div className="flex items-center gap-x-3">
              <div className="w-24 h-24 rounded-full">
                <img
                  src={service.media || "/default-service.png"}
                  alt="Service Image"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-service.png";
                  }}
                />
              </div>
              <div className="flex flex-col gap-y-1 flex-1 w-full">
                <p className="font-medium text-heading4 text-semantic-content-contentPrimary">
                  {service.name || "Service Name"}
                </p>
                <p className="font-medium text-heading4 text-semanticExtensions-content-contentAccent">
                  ${service.minSpend || "N/A"} min spend
                </p>
                <p className="font-normal text-body1 text-semantic-content-contentSecondary">
                  {service.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Review Section */}
        {booking.reviews &&
          booking.reviews.filter((review) => !review.profileId).length > 0 && (
            <div className="mb-8">
              <h2 className="text-heading3 font-semibold text-semantic-content-contentPrimary mb-4">
                Your Review
              </h2>
              <div className="border-b border-semantic-border-borderPrimary pb-6">
                {booking.reviews
                  .filter((review) => !review.profileId)
                  .map((review, index) => (
                    <div key={index} className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star1
                              key={star}
                              size={20}
                              className={
                                star <= (review.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                          {review.rating}/5
                        </p>
                      </div>
                      <p className="text-body2 text-semantic-content-contentTertionary">
                        {moment(review.createdAt).format("MMM DD, YYYY")}
                      </p>
                      {review.comment && (
                        <p className="text-body1 text-semantic-content-contentPrimary">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Customer Review Section */}
        {booking.reviews &&
          booking.reviews.filter((review) => review.profileId).length > 0 && (
            <div className="mb-8">
              <h2 className="text-heading3 font-semibold text-semantic-content-contentPrimary mb-4">
                Customer Review
              </h2>
              <div className="border-b border-semantic-border-borderPrimary pb-6">
                {booking.reviews
                  .filter((review) => review.profileId)
                  .map((review, index) => (
                    <div key={index} className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star1
                              key={star}
                              size={20}
                              className={
                                star <= (review.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-body1 font-medium text-semantic-content-contentPrimary">
                          {review.rating}/5
                        </p>
                      </div>
                      <p className="text-body2 text-semantic-content-contentTertionary">
                        {moment(review.createdAt).format("MMM DD, YYYY")}
                      </p>
                      {review.comment && (
                        <p className="text-body1 text-semantic-content-contentPrimary">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={onCancelBooking}
        loading={updateStatusLoading}
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal}
        onClose={() => setRatingModal(false)}
        onSubmit={onSubmitRating}
        isSubmitting={isSubmittingReview}
      />
    </div>
  );
};
