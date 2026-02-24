import { useState } from "react";
import { Loader } from "../../components/Loader";
import { EmptyMessage } from "../../components/EmptyMessage";
import { Edit2, SearchNormal1, Trash, Eye, TickCircle } from "iconsax-react";
import DropdownEditMenu from "../../components/DropdownEditMenu";
import { capitalizeFirstLetter } from "../../utils/Utils";
import { CancelBookingModal } from "../../components/CancelBookingModal";
import { showToast } from "../../utils/logs";
import {
  useGetBookings,
  useUpdateBookingsStatus,
  BOOKING_API_ROUTES,
} from "../../api/bookingsApis";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const BookingsNew = () => {
  const { data: bookingsData, isPending } = useGetBookings(10);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [cancelModal, setCancelModal] = useState(false);
  const [booking, setBooking] = useState(null);
  const [search, setSearch] = useState("");

  const { mutateAsync: updateBookingStatus, isPending: updateStatusLoading } =
    useUpdateBookingsStatus();

  // Flatten the infinite query data to get all bookings
  const bookings = bookingsData?.pages?.flatMap((page) => page.data) || [];

  // Debug: Log the actual data structure
  console.log("Bookings data:", bookings);
  console.log("First booking:", bookings[0]);

  const onMarkAsConfirmed = async (bookingItem) => {
    try {
      console.log("booking item id", bookingItem);

      await updateBookingStatus({
        bookingId: bookingItem.id,
        status: "APPROVED",
      });
      showToast("Booking status updated to Confirmed", "success");
      queryClient.invalidateQueries({
        queryKey: [BOOKING_API_ROUTES.BOOKINGS],
      });
      setBooking(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  const onCancelBooking = async (reason) => {
    try {
      await updateBookingStatus({
        bookingId: booking.id,
        status: "CANCELLED",
        reason: reason,
      });
      showToast("Booking has been cancelled", "success");
      queryClient.invalidateQueries({
        queryKey: [BOOKING_API_ROUTES.BOOKINGS],
      });
      setCancelModal(false);
      setBooking(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  let searchBookings = search
    ? bookings?.filter(
        (item) =>
          item.id?.toLowerCase().includes(search.toLowerCase()) ||
          item.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
          item.service_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.space_name?.toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

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

  return (
    <div className="w-full h-full flex flex-1 flex-col gap-y-4 sm:gap-y-6 overflow-y-auto">
      <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary px-4 sm:px-0">
        Bookings
      </h1>

      <div className="bg-semantic-background-backgroundPrimary flex flex-1 flex-col rounded-2xl shadow-md p-4 sm:p-6 space-y-4">
        {/* Top actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-3 sm:gap-y-2">
          {/* Search */}
          <div className="w-full sm:w-auto flex flex-row items-center gap-x-3 sm:gap-x-4 px-3 sm:px-4 h-[45px] sm:h-[55px] rounded-full bg-semantic-background-backgroundSecondary">
            <SearchNormal1 className="text-semantic-content-contentInverseTertionary w-5 h-5 sm:w-6 sm:h-6" />
            <input
              placeholder="Search booking"
              className="h-full flex flex-1 bg-transparent placeholder-semantic-content-contentInverseTertionary text-sm sm:text-body1 font-medium text-semantic-content-contentPrimary border-none focus:outline-none focus:ring-0 p-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isPending ? (
          <Loader />
        ) : searchBookings?.length ? (
          <div className="relative w-full flex flex-col h-full overflow-x-auto overflow-y-auto pb-2">
            <table className="w-full min-w-[600px]">
              <thead className="text-left text-body2 font-normal text-semantic-content-contentPrimary">
                <tr className="h-[50px] border-b border-semantic-background-backgroundTertionary">
                  <th className="hidden sm:table-cell">Customer Name</th>
                  <th>Service</th>
                  <th className="hidden md:table-cell">Hours</th>
                  <th className="hidden lg:table-cell">Guests</th>
                  <th className="hidden sm:table-cell">Booking Time</th>
                  <th className="hidden md:table-cell">Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-semantic-content-contentPrimary text-left divide-y divide-semantic-background-backgroundTertionary overflow-y-auto">
                {searchBookings.map((bookingItem, index) => {
                  // Debug: Log each booking item to see its structure
                  if (index === 0) {
                    console.log("Booking item structure:", bookingItem);
                    console.log("Available keys:", Object.keys(bookingItem));
                  }

                  return (
                    <tr
                      key={bookingItem.id}
                      className="font-normal text-body2 text-semantic-content-contentPrimary"
                    >
                      {/* Customer Details - Hidden on mobile */}
                      <td className="py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-semantic-background-backgroundSecondary flex items-center justify-center">
                            <img
                              src={
                                bookingItem.customer?.avatar ||
                                bookingItem.customer?.profile_picture ||
                                "/default-avatar.png"
                              }
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div className="w-8 h-8 rounded-full bg-semantic-content-contentTertionary text-white text-xs font-medium items-center justify-center hidden">
                              {(
                                bookingItem.customer?.name ||
                                bookingItem.customer?.first_name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-semantic-content-contentPrimary">
                              {`${bookingItem.customer?.first_name} ${bookingItem.customer.last_name}` ||
                                "N/A"}
                            </div>
                            <div className="text-xs text-semantic-content-contentTertionary">
                              {bookingItem.customer?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Details - Always visible */}
                      <td className="py-4">
                        <td className="py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-semantic-background-backgroundSecondary flex items-center justify-center">
                              <img
                                src={bookingItem.bookingServices[0].media}
                                alt="Service Image"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-semantic-content-contentPrimary">
                                {bookingItem.bookingServices[0].name || "N/A"}
                              </div>
                              <div className="text-xs text-semantic-content-contentTertionary">
                                {`${bookingItem.bookingServices[0].minSpend} min spend` ||
                                  "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                      </td>

                      {/* Hours - Hidden on mobile and small screens */}
                      <td className="py-4 hidden md:table-cell">
                        <div className="text-sm font-medium">
                          {bookingItem.duration || "0"} hrs
                        </div>
                      </td>

                      {/* Guests - Hidden on mobile and medium screens */}
                      <td className="py-4 hidden lg:table-cell">
                        <div className="text-sm font-medium">
                          {bookingItem.no_of_guests}
                        </div>
                      </td>

                      {/* Booking Time - Hidden on mobile */}
                      <td className="py-4 hidden sm:table-cell">
                        <div className="text-sm font-medium">
                          {moment(bookingItem.check_in).format(
                            "DD/MM/YYYY hh:mm A"
                          )}
                        </div>
                      </td>

                      {/* Status - Hidden on mobile and small screens */}
                      <td className="py-4 hidden md:table-cell">
                        <div className="items-start">
                          <span
                            className={`rounded-full ${getStatusColor(
                              bookingItem.status
                            )} text-semantic-content-contentInversePrimary text-caption2 font-normal py-3 px-4`}
                          >
                            {getStatusDisplayName(bookingItem.status)}
                          </span>
                        </div>
                      </td>

                      {/* Actions - Always visible but responsive */}
                      <td className="py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <DropdownEditMenu
                            className="relative inline-flex font-normal text-body1 text-semantic-content-contentPrimary"
                            align="right"
                          >
                            <button
                              onClick={() => {
                                navigate(`/booking-details/${bookingItem.id}`);
                              }}
                              className="flex py-1 px-2 sm:py-2 sm:px-3 items-center gap-x-1 sm:gap-x-2 text-xs sm:text-sm"
                            >
                              <Eye size={14} className="sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            {bookingItem.status?.toUpperCase() ===
                              "PENDING" && (
                              <>
                                <button
                                  onClick={() => {
                                    setBooking(bookingItem);
                                    onMarkAsConfirmed(bookingItem);
                                  }}
                                  className="flex py-1 px-2 sm:py-2 sm:px-3 items-center gap-x-1 sm:gap-x-2 text-xs sm:text-sm"
                                >
                                  <TickCircle
                                    size={14}
                                    className="sm:w-4 sm:h-4"
                                  />
                                  <span className="hidden sm:inline">
                                    Confirmed
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    setBooking(bookingItem);
                                    setCancelModal(true);
                                  }}
                                  className="flex py-1 px-2 sm:py-2 sm:px-3 items-center gap-x-1 sm:gap-x-2 text-xs sm:text-sm text-red-600"
                                >
                                  <Trash size={14} className="sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">
                                    Cancel
                                  </span>
                                </button>
                              </>
                            )}
                          </DropdownEditMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyMessage
            message={`No bookings yet!\nYour bookings will appear here once customers start making reservations.`}
          />
        )}
      </div>

      <CancelBookingModal
        isOpen={cancelModal}
        onClose={() => {
          setCancelModal(false);
          setBooking(null);
        }}
        onConfirm={onCancelBooking}
        loading={updateStatusLoading}
      />
    </div>
  );
};
