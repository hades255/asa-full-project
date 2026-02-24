import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import DeleteButton from '../../partials/actions/DeleteButton';
import DateSelect from '../../components/DateSelect';
import FilterButton from '../../components/DropdownFilter';
import CustomersTable from '../../partials/customers/CustomersTable';
import PaginationClassic from '../../components/PaginationClassic';
import FintechCard05 from '../../partials/fintech/FintechCard05';
import AnalyticsCard02 from '../../partials/analytics/AnalyticsCard02';
import BookingOrderDetailsTable from '../../components/bookings/BookingOrderDetailsTable';
import BookingCustomerOverview from '../../components/bookings/BookingCustomerOverview';

import CalendarIcon from '../../images/calendar-icon.svg';
import ProfileAvatar2 from '../../images/profile-avatar2.svg';
import DropdownFull from '../../components/DropdownFull';
import DropdownInputForm from '../../components/DropdownInputForm';

function BookingDetailsForm() {

  const hourArray = [
    { id: 0, period: '1 Hour' },
    { id: 1, period: '2 Hours' },
    { id: 2, period: '3 Hours' },
    { id: 3, period: '4 Hours' },
    { id: 4, period: '5 Hours' },
    { id: 5, period: '6 Hours' },
    { id: 6, period: '7 Hours' },
    { id: 7, period: '8 Hours' },
    { id: 8, period: '9 Hours' },
    { id: 9, period: '10 Hours' },
    { id: 10, period: '11 Hours' },
    { id: 11, period: '12 Hours' },
  ];

  const personsArray = [
    { id: 0, period: '1 Person' },
    { id: 1, period: '2 Persons' },
    { id: 2, period: '3 Persons' },
    { id: 3, period: '4 Persons' },
    { id: 4, period: '5 Persons' },
    { id: 5, period: '6 Persons' },
    { id: 6, period: '7 Persons' },
    { id: 7, period: '8 Persons' },
    { id: 8, period: '9 Persons' },
    { id: 9, period: '10 Persons' },
    { id: 10, period: '11 Persons' },
    { id: 11, period: '12 Persons' },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

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
              <div className="flex flex-col col-span-full xl:col-span-12 bg-white shadow-lg rounded-2xl p-5">
                {/* Card content */}
                <div className="flex flex-col h-full">
                  {/* Live visitors number */}
                  <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center mb-4">
                      <div className="w-19 h-19 shrink-0 mr-3">
                        <img className="rounded-full" src={ProfileAvatar2} width="75" height="75" alt="Profile" />
                      </div>
                      <div>
                        <div className="text-base font-normal text-black">John Doe</div>
                        <div className="text-base text-lightGray">johndoe@gmail.com</div>
                        <div className="text-base font-semibold text-black">090909000</div>
                      </div>
                    </div>
                    <button className="rounded-full bg-[#F6BC2F] text-base text-black font-semibold shadow-sm transition duration-150 px-3 py-1">
                      Pending
                    </button>
                  </div>

                  <div className="grow px-5 pt-3 pb-1">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-black">Hotel Details</h2>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="w-5 h-5 text-black bg-gray-100 border-black rounded-sm focus:ring-gray-300 dark:focus:ring-gray-100 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="date">
                            Checkin
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <img src={CalendarIcon} alt="Date" className="invert" size={20} />
                            <input
                              id="date"
                              type="date"
                              className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="time">
                            Checkin
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <img src={CalendarIcon} alt="Time" className="invert" size={20} />
                            <input
                              id="time"
                              type="time"
                              className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4">
                            No. of Hours
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <DropdownInputForm options={hourArray} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4">
                            No of Persons/Guest
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <DropdownInputForm options={personsArray} />
                          </div>
                        </div>
                      </div>

                      <p className='text-right text-sm underline mt-4 cursor-pointer'>Add More</p>
                    </div>

                    <hr className="my-4 border-t border-slate-200 dark:border-slate-700" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-black">Gym Details</h2>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="w-5 h-5 text-black bg-gray-100 border-black rounded-sm focus:ring-gray-300 dark:focus:ring-gray-100 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="date">
                            Checkin
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <img src={CalendarIcon} alt="Date" className="invert" size={20} />
                            <input
                              id="date"
                              type="date"
                              className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="time">
                            Checkin
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <img src={CalendarIcon} alt="Time" className="invert" size={20} />
                            <input
                              id="time"
                              type="time"
                              className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4">
                            No. of Hours
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <DropdownInputForm options={hourArray} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4">
                            No of Persons/Guest
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <DropdownInputForm options={personsArray} />
                          </div>
                        </div>
                      </div>

                      <p className='text-right text-sm underline mt-4 cursor-pointer'>Add More</p>
                    </div>

                    <hr className="my-4 border-t border-slate-200 dark:border-slate-700" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-black">Restaurant Details</h2>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="w-5 h-5 text-black bg-gray-100 border-black rounded-sm focus:ring-gray-300 dark:focus:ring-gray-100 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="date">
                            Checkin
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <img src={CalendarIcon} alt="Date" className="invert" size={20} />
                            <input
                              id="date"
                              type="date"
                              className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="time">
                            Checkin
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <img src={CalendarIcon} alt="Time" className="invert" size={20} />
                            <input
                              id="time"
                              type="time"
                              className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4">
                            No. of Hours
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <DropdownInputForm options={hourArray} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-black text-base font-medium mb-2 pl-4">
                            No of Persons/Guest
                          </label>
                          <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4">
                            <DropdownInputForm options={personsArray} />
                          </div>
                        </div>
                      </div>

                      <p className='text-right text-sm underline mt-4 cursor-pointer'>Add More</p>
                    </div>

                    <button className="w-full mt-9 bg-black text-white text-center py-3 rounded-full text-base font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

      </div>

    </div>
  );
}

export default BookingDetailsForm;
