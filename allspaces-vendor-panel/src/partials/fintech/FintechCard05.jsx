import React from "react";
import { useGetOrders } from "../../api/ordersApis";

function FintechCard05() {
  const { data: orders, isPending } = useGetOrders();

  if (isPending || !orders) return null;

  return (
    <div className="col-span-full bg-white shadow-lg rounded-2xl p-5">
      <h2 className="font-semibold text-base text-black mb-4">
        Order Overviews
      </h2>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          {/* Table header */}
          <thead className="text-sm text-black text-left">
            <tr className="h-10 border-b border-[#E8E8E8]">
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-left">Name</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-left">Email</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-left">Date</div>
              </th>
              <th className="p-2 whitespace-nowrap">
                <div className="font-normal text-right">Amount</div>
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm text-black text-left divide-y divide-[#E8E8E8]">
            {/* Row */}
            {orders.length > 0 ? (
              orders.slice(0, 6).map((order, index) => (
                <tr key={index} className="h-10 text-sm">
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 rounded-full mr-2 sm:mr-3 bg-indigo-500">
                        <svg
                          className="w-9 h-9 fill-current text-indigo-50"
                          viewBox="0 0 36 36"
                        >
                          <path d="M24.446 19.335a2.5 2.5 0 00-3.522 3.194c-.845.63-1.87.97-2.924.971a4.979 4.979 0 01-1.113-.135 4.436 4.436 0 01-1.343 1.682 6.91 6.91 0 006.9-1.165 2.5 2.5 0 002-4.547h.002zM20.431 11.938a2.5 2.5 0 10-.4 2.014 5.027 5.027 0 012.723 3.078c.148-.018.297-.028.446-.03a4.5 4.5 0 011.7.334 7.023 7.023 0 00-4.469-5.396zM14.969 20.25a2.49 2.49 0 00-1.932-1.234A4.624 4.624 0 0113 18.5a4.97 4.97 0 011.348-3.391 4.456 4.456 0 01-.788-2.016A6.989 6.989 0 0011 18.5c.003.391.04.781.11 1.166a2.5 2.5 0 103.859.584z" />
                        </svg>
                      </div>
                      <div className="text-slate-800 dark:text-slate-100">
                        {order.user.first_name || "Space User"}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div>{order.user.email}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div>{order.time}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-slate-800 dark:text-slate-100 text-right">
                      ${order.amount?.toFixed(2) || 0}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-8" colSpan="100%">
                  No Order Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FintechCard05;
