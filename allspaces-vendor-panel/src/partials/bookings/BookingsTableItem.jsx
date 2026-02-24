import DropdownEditMenu from "../../components/DropdownEditMenu";

import UserAvatar from "../../images/profile_avatar.svg";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/Utils";
import moment from "moment";

function BookingsTableItem(props) {
  console.log("pro", props);

  return (
    <tr className="text-sm h-10">
      <td className="p-2 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 shrink-0 mr-2 sm:mr-3">
            <img
              className="rounded-full"
              src={UserAvatar}
              width="40"
              height="40"
              alt={props.name}
            />
          </div>
          <div className="block text-xs font-normal text-black">
            <span className="font-bold">{`${props.first_name} ${props.last_name}`}</span>
            <br />
            <span>{props.email}</span>
          </div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.eco_score}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left text-emerald-500">
          {moment(props.checkin).format("MM/DD/YYYY")}
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{props.no_of_guests}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-center">
          <div
            className={`rounded-full ${
              props.status != "COMPLETED"
                ? "bg-[#F6BC2F] text-black"
                : "bg-[#000000] text-white"
            } text-sm shadow-sm transition w-fit duration-150 px-3 py-1`}
          >
            {capitalizeFirstLetter(props.status)}
          </div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-center">{`$ ${props.spend.toFixed(2)}`}</div>
      </td>
      <td className="p-2 whitespace-nowrap w-px">
        {/* Menu button */}
        <div className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
          <span className="sr-only">Action</span>
          <DropdownEditMenu className="relative inline-flex" align="right">
            <li>
              <Link
                to={`/booking-order-details?id=${props.id}`}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
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

export default BookingsTableItem;
