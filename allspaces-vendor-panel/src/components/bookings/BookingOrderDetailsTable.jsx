import { useUpdateBookingsStatus } from "../../api/bookingsApis";
import { capitalizeFirstLetter } from "../../utils/Utils";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Rating } from "@smastrom/react-rating";

function BookingOrderDetailsTable({ id, booking }) {
  let bookingItem = { ...booking };
  const navigate = useNavigate();
  const { mutateAsync: updateBookingStatus, isPending: updateLoading } =
    useUpdateBookingsStatus();

  const bookingConfirmedHandle = async (status) => {
    try {
      await updateBookingStatus({
        booking_id: bookingItem.id,
        status: status,
      });

      bookingItem = { ...bookingItem, status };
      toast.success("Status has been updated");
      navigate("/all-bookings");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-2xl p-5">
      <header className="flex justify-between border-b border-[#E8E8E8] pb-4">
        <h2 className="font-semibold text-base text-black">Booking Details</h2>
        <button
          className={`rounded-full ${
            bookingItem.status == "PENDING"
              ? "bg-[#F6BC2F] text-white"
              : bookingItem.status == "APPROVED"
              ? "bg-[#cc9509] text-white"
              : bookingItem.status == "COMPLETED"
              ? "bg-[#000000] text-white"
              : "bg-[#ff2727] text-white"
          } text-base font-semibold shadow-sm transition duration-150 px-3 py-1`}
        >
          {capitalizeFirstLetter(bookingItem.status)}
        </button>
      </header>
      <div className="flex flex-col py-2">
        <div className="overflow-x-auto">
          <QRCode value={id} size={124} />
          <div className="py-4 space-y-2">
            <h3 className="font-medium text-base">Summary</h3>
            <hr />
            <div className="flex flex-row items-center justify-between">
              <p className="font-regular text-sm">No. of Guests</p>
              <p className="font-regular text-sm">{`Host + ${bookingItem.no_of_guests}`}</p>
            </div>
            <div className="flex flex-row items-center justify-between">
              <p className="font-regular text-sm">Time & Date</p>
              <p className="font-regular text-sm">{`${moment(
                bookingItem.check_in
              ).format("DD MMM YYYY")}`}</p>
            </div>
            <div className="flex flex-row items-center justify-between">
              <p className="font-regular text-sm">Location</p>
              <p className="font-regular text-sm">{`${bookingItem.address}`}</p>
            </div>
          </div>

          <div className="py-4 space-y-2">
            <h3 className="font-medium text-base">Booked Services</h3>
            <hr />
            <div>
              {bookingItem.bookingServices.map((item) => (
                <div className="flex items-center gap-x-3">
                  <img
                    src={item.media}
                    className="w-[64px] h-[64px] rounded-full"
                  />
                  <div>
                    <p className="font-normal text-sm">{item.name}</p>
                    <p className="font-normal text-sm text-[#5E5E5E]">
                      {item.description}
                    </p>
                    <p className="font-normal text-sm">{`$ ${item.minSpend} min.spend`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {booking.isReviewed && (
          <div className="py-4 space-y-2">
            <h3 className="font-medium text-base">Customer Review</h3>
            <hr />
            <div>
              <Rating
                style={{ maxWidth: 250 }}
                value={booking.reviews[0].rating}
                onChange={() => {}}
                isDisabled={true}
              />
              <p>{booking.reviews[0].comment}</p>
            </div>
          </div>
        )}
        {bookingItem.status === "PENDING" ? (
          <div className="flex items-center justify-between gap-x-4">
            <button
              onClick={() => bookingConfirmedHandle("APPROVED")}
              className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4 mt-4"
            >
              Approve
            </button>
            <button
              onClick={() => bookingConfirmedHandle("CANCELLED")}
              className="w-full btn rounded-full bg-red-500 text-white shadow-sm transition duration-150 px-12 py-4 mt-4"
            >
              Cancel
            </button>
          </div>
        ) : (
          bookingItem.status === "APPROVED" && (
            <button
              onClick={() => bookingConfirmedHandle("COMPLETED")}
              className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4 mt-4"
            >
              Mark as Completed
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default BookingOrderDetailsTable;
