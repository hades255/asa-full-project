import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import BookingOrderDetailsTable from "../../components/bookings/BookingOrderDetailsTable";
import BookingCustomerOverview from "../../components/bookings/BookingCustomerOverview";
import { useSearchParams } from "react-router-dom";
import bookingsApis, { useGetBookingById } from "../../api/bookingsApis";

function BookingOrderDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [queryParams] = useSearchParams();

  const id = queryParams.get("id");

  const { data: booking, isPending } = useGetBookingById(id);

  if (isPending || !booking) return;
  // useEffect(() => {
  //   const fetchBooking = async () => {
  //     try {
  //       const response = await bookingsApis.getBookingByID(id);
  //       console.log("Final response bookings index => ", response);

  //       if (response.status === 200) {
  //         setBooking(response.data);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   fetchBooking();
  // }, []);

  // useEffect(() => {
  //   console.log("A booking data => ", booking);
  // });

  // const handleSelectedItems = (selectedItems) => {
  //   setSelectedItems([...selectedItems]);
  // };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Bookings Details
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <BookingOrderDetailsTable id={id} booking={booking} />
              <BookingCustomerOverview customer={booking.customer} />
            </div>

            {/* {booking.status != "COMPLETED" ?
              <div className="w-full bg-white rounded-2xl md:flex md:justify-between md:items-center space-x-4 mt-8 p-5">
                <div className="block">
                  <div className="text-3xl font-semibold text-[#0E8345]">
                    Fully Booked? Consider Offering a Counter Option!
                  </div>
                  <div className="text-base font-normal text-lightGray mt-2">
                    Don't let an opportunity slip away! If you're fully booked, why not provide a counter offer? Suggest alternative dates, package upgrades, or partner hotel recommendations to ensure the guest still enjoys an exceptional experience while keeping them engaged with your services.
                  </div>
                </div>
                <ul className="shrink-0 flex flex-wrap justify-end md:justify-start -space-x-3 -ml-px">
                  <Link
                    to="/booking-details-form"
                    className="rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4"
                  >
                    Offer Now
                  </Link>
                </ul>
              </div>
              :
              <div className="w-full bg-white rounded-2xl md:flex md:justify-between md:items-center space-x-4 mt-8 p-5">
                <div className="block">
                  <div className="text-base font-semibold text-black">
                    Review
                  </div>
                  <div className="flex gap-1 text-base font-normal text-black mt-2">
                    <img src={ReviewIcon} width={15} height={15} />
                    <img src={ReviewIcon} width={15} height={15} />
                    <img src={ReviewIcon} width={15} height={15} />
                    <img src={ReviewIcon} width={15} height={15} />
                    <img src={ReviewIcon} width={15} height={15} />
                    5
                  </div>
                  <div className="text-base font-normal text-lightGray mt-2">
                    The service was outstanding, with friendly and attentive staff who made every effort to ensure a comfortable stay. The room was spotless, well-equipped, and inviting, while the dining experience was top-notch. Facilities like the pool and gym were well-maintained, though the Wi-Fi could be faster during busy hours. Overall, a highly recommended stay!
                  </div>
                </div>
              </div>
            } */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default BookingOrderDetails;
