import React from 'react';
import DropdownEditMenu from '../../components/DropdownEditMenu';
import { Link } from 'react-router-dom';

function CustomersTableItem(props) {
  return (
    <tr className='text-sm h-10'>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.name}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.email}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.location}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.orders}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.lastOrder}</div>
      </td>
      <td className="p-2 whitespace-nowrap w-px">
        {/* Menu button */}
        <div className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
          <span className="sr-only">Action</span>
          <DropdownEditMenu className="relative inline-flex" align='right'>
            <li>
              <Link
                to={`/booking-order-details?id=${props.id}`}
                className="font-normal text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
              >
                Booking Details
              </Link>
            </li>
          </DropdownEditMenu>
        </div>
      </td>
    </tr>
  );
}

export default CustomersTableItem;
