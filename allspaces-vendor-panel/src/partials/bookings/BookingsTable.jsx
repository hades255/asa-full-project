import React, { useState, useEffect } from "react";
import Booking from "./BookingsTableItem";

import Image01 from "../../images/user-40-01.jpg";
import Image02 from "../../images/user-40-02.jpg";
import Image03 from "../../images/user-40-03.jpg";
import Image04 from "../../images/user-40-04.jpg";
import Image05 from "../../images/user-40-05.jpg";
import Image06 from "../../images/user-40-06.jpg";
import Image07 from "../../images/user-40-07.jpg";
import Image08 from "../../images/user-40-08.jpg";
import Image09 from "../../images/user-40-09.jpg";
import Image10 from "../../images/user-40-10.jpg";
import bookingsApis, { useGetBookings } from "../../api/bookingsApis";

const LIMIT = 10;

function BookingsTable({ selectedItems }) {
  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending,
  } = useGetBookings(LIMIT);

  const bookings = data?.pages.flatMap((page) => page.data) ?? [];

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     try {
  //       const response = await bookingsApis.fetchBookings();
  //       console.log("Final response bookings index => ", response);

  //       if (response.status === 200) {
  //         console.log("resoni", response.data);

  //         setList(response.data);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   fetchBookings();
  // }, []);

  // const handleSelectAll = () => {
  //   setSelectAll(!selectAll);
  //   setIsCheck(list.map((li) => li.id));
  //   if (selectAll) {
  //     setIsCheck([]);
  //   }
  // };

  // const handleClick = (e) => {
  //   const { id, checked } = e.target;
  //   setSelectAll(false);
  //   setIsCheck([...isCheck, id]);
  //   if (!checked) {
  //     setIsCheck(isCheck.filter((item) => item !== id));
  //   }
  // };

  // useEffect(() => {
  //   selectedItems(isCheck);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isCheck]);
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 relative">
      <h2 className="font-semibold text-base text-black mb-4">
        Bookings Overviews
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          {/* Table header */}
          <thead className="text-sm text-black text-left">
            <tr className="h-10 border-b border-[#E8E8E8]">
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-left">User</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-left">Eco Score</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-left">Check In</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal"># of Guests</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal">Status</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal">Min. Spend</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <span className="font-normal">Action</span>
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm text-black text-left divide-y divide-[#E8E8E8]">
            {bookings?.length > 0 ? (
              bookings.map((booking) => {
                return (
                  <Booking
                    key={booking.id}
                    id={booking.id}
                    image={booking.image}
                    first_name={booking.customer.first_name}
                    last_name={booking.customer.last_name}
                    email={booking.customer.email}
                    phone={booking.customer.phone}
                    no_of_guests={booking.no_of_guests}
                    eco_score={booking.customer.eco_score}
                    checkin={booking.check_in}
                    status={booking.status}
                    spend={booking.amount}
                    // handleClick={handleClick}
                    // isChecked={isCheck.includes(booking.id)}
                  />
                );
              })
            ) : (
              <tr>
                <td className="text-center py-8" colSpan="100%">
                  No booking found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsTable;
