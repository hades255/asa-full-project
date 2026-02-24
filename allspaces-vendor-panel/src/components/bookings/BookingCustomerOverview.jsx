import React from "react";
import LineChart from "../../charts/LineChart04";
import { Link } from "react-router-dom";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

import ProfileAvatar2 from "../../images/profile-avatar2.svg";
import RatingIcon from "../../images/reviews-icon.svg";
import { Facebook, Google, Instagram, LinkSquare } from "iconsax-react";

function BookingCustomerOverview({ customer }) {
  return (
    <div className="flex flex-col col-span-full xl:col-span-4 bg-white shadow-lg rounded-2xl p-5">
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Live visitors number */}
        <div className="border-b border-slate-100">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 shrink-0 mr-3">
              <img
                className="rounded-full"
                src={ProfileAvatar2}
                width="55"
                height="55"
                alt="Profile"
              />
            </div>
            <div>
              <div className="text-base font-semibold text-black break-all">{`${customer.clerkCustomerData.first_name} ${customer.clerkCustomerData.last_name}`}</div>
              <div className="text-base text-lightGray break-all">
                {customer.clerkCustomerData.email_addresses[0].email_address}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="grow pt-3 pb-1">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-slate-300">
              <tbody className="text-base text-black font-normal">
                <tr>
                  <td className="py-2">
                    <div className="text-left">Eco Score</div>
                  </td>
                  <td className="py-2">
                    <div className="font-bold text-right text-[#0E8345]">
                      {customer.eco_score}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <div className="text-left">Rating</div>
                  </td>
                  <td className="py-2 flex items-center justify-end gap-x-2">
                    <img src={RatingIcon} width={15} height={15} />
                    <div className="text-right text-lightGray">
                      {`${customer.averageRating} (${customer.reviewsCount})`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <div className="text-left">Phone #</div>
                  </td>
                  <td className="py-2">
                    <div className="text-right text-lightGray">
                      {customer.clerkCustomerData.phone_numbers[0].phone_number}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <div className="text-left">Social Accounts</div>
                  </td>
                  <td className="py-2 flex flex-row items-center justify-end gap-x-2">
                    {customer.clerkCustomerData.external_accounts.map((item) =>
                      item.object.toLowerCase().includes("google") ? (
                        <Google size={24} />
                      ) : item.object.toLowerCase().includes("facebook") ? (
                        <Facebook size={24} />
                      ) : item.object.toLowerCase().includes("instagram") ? (
                        <Instagram size={24} />
                      ) : (
                        <LinkSquare size={24} />
                      )
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCustomerOverview;
