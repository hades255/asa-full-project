import React, { useState, useEffect } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import DashboardIcon from "../images/dashboard-icon.svg";
import { Link } from "react-router-dom";
import { useGetBookingsCalendar } from "../api/bookingsApis";

function BookingsCalendar() {
  const today = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  // eslint-disable-next-line no-unused-vars
  const [year, setYear] = useState(today.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [startingBlankDays, setStartingBlankDays] = useState([]);
  const [endingBlankDays, setEndingBlankDays] = useState([]);

  const { data: bookingsCalendar, isPending } = useGetBookingsCalendar();
  console.log("bookingsCalendar", JSON.stringify(bookingsCalendar));

  const events = bookingsCalendar?.events || [];

  // useEffect(() => {
  //   const retrieveBookingsForCalendar = async () => {
  //     try {
  //       const response = await bookingsApis.bookingsForCalendarView();
  //       console.log("Final response profiles index => ", response);

  //       if (response.status === 200) {
  //         setEvents(response.data.events);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   retrieveBookingsForCalendar();
  // }, []);

  // const events = [
  //   // Previous month
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 8, 3),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 8, 7),
  //     eventName: '⛱️ Relax for 2 at Marienbad',
  //     eventColor: 'indigo'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 12, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 11),
  //     eventName: 'Team Catch-up',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 18, 2),
  //     eventEnd: '',
  //     eventName: '✍️ New Project (2)',
  //     eventColor: 'yellow'
  //   },
  //   // Current month
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 11),
  //     eventName: 'Meeting w/ Patrick Lin',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 19),
  //     eventEnd: '',
  //     eventName: 'Reservation at La Ginestre',
  //     eventColor: 'indigo'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 9),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 10),
  //     eventName: '✍️ New Project',
  //     eventColor: 'yellow'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 21),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 22),
  //     eventName: '⚽ 2021 - Semi-final',
  //     eventColor: 'red'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 11),
  //     eventName: 'Meeting w/Carolyn',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 13),
  //     eventEnd: '',
  //     eventName: 'Pick up Marta at school',
  //     eventColor: 'emerald'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 14),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 15),
  //     eventName: 'Meeting w/ Patrick Lin',
  //     eventColor: 'emerald'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 19),
  //     eventEnd: '',
  //     eventName: 'Reservation at La Ginestre',
  //     eventColor: 'indigo'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 11),
  //     eventName: '⛱️ Relax for 2 at Marienbad',
  //     eventColor: 'indigo'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 19),
  //     eventEnd: '',
  //     eventName: '⚽ 2021 - Semi-final',
  //     eventColor: 'red'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 11),
  //     eventName: 'Team Catch-up',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 2),
  //     eventEnd: '',
  //     eventName: 'Pick up Marta at school',
  //     eventColor: 'emerald'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 3),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 7),
  //     eventName: '✍️ New Project (2)',
  //     eventColor: 'yellow'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11),
  //     eventName: 'Team Catch-up',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 19),
  //     eventEnd: '',
  //     eventName: '⚽ 2021 - Semi-final',
  //     eventColor: 'red'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 23, 0),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 23, 23),
  //     eventName: 'You stay at Meridiana B&B',
  //     eventColor: 'indigo'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 11),
  //     eventName: 'Meeting w/ Kylie Joh',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 29, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 29, 11),
  //     eventName: 'Call Request ->',
  //     eventColor: 'sky'
  //   },
  //   // Next month
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 2, 3),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 2, 7),
  //     eventName: '✍️ New Project (2)',
  //     eventColor: 'yellow'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 14, 10),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 11),
  //     eventName: 'Team Catch-up',
  //     eventColor: 'sky'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 25, 2),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 25, 3),
  //     eventName: 'Pick up Marta at school',
  //     eventColor: 'emerald'
  //   },
  //   {
  //     eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 27, 21),
  //     eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 27, 22),
  //     eventName: '⚽ 2021 - Semi-final',
  //     eventColor: 'red'
  //   },
  // ];

  const isToday = (date) => {
    const day = new Date(year, month, date);
    return today.toDateString() === day.toDateString() ? true : false;
  };

  const getEvents = (date) => {
    const filtered_events = events?.filter(
      (e) =>
        new Date(e.eventStart).toDateString() ===
        new Date(year, month, date).toDateString()
    );
    return filtered_events;
  };

  const eventColor = (color) => {
    switch (color) {
      case "sky":
        return "text-white bg-sky-500";
      case "green":
        return "text-white bg-green-500";
      case "yellow":
        return "text-white bg-amber-500";
      case "red":
        return "text-white bg-rose-400";
      default:
        return "text-white bg-amber-500";
    }
  };

  const getDays = () => {
    const days = new Date(year, month + 1, 0).getDate();

    // starting empty cells (previous month)
    const startingDayOfWeek = new Date(year, month).getDay();
    let startingBlankDaysArray = [];
    for (let i = 1; i <= startingDayOfWeek; i++) {
      startingBlankDaysArray.push(i);
    }

    // ending empty cells (next month)
    const endingDayOfWeek = new Date(year, month + 1, 0).getDay();
    let endingBlankDaysArray = [];
    for (let i = 1; i < 7 - endingDayOfWeek; i++) {
      endingBlankDaysArray.push(i);
    }

    // current month cells
    let daysArray = [];
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }

    setStartingBlankDays(startingBlankDaysArray);
    setEndingBlankDays(endingBlankDaysArray);
    setDaysInMonth(daysArray);
  };

  useEffect(() => {
    getDays();
  }, []);

  if (isPending) return null;

  return (
    <div className="flex h-[100dvh] bg-extraLightLight overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  <span>Bookings</span>
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <Link to="/home/bookings-analytics">
                  <div className="w-14 h-14 rounded-full bg-black p-4">
                    <img src={DashboardIcon} alt="" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Calendar table */}
            <div className="bg-white dark:bg-slate-800 rounded-sm shadow overflow-hidden">
              {/* Days of the week */}
              <div className="grid grid-cols-7 gap-px border-b border-slate-200 dark:border-slate-700">
                {dayNames.map((day) => {
                  return (
                    <div className="px-1 py-3" key={day}>
                      <div className="text-slate-500 text-sm font-medium text-center lg:hidden">
                        {day.substring(0, 3)}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center hidden lg:block">
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700">
                {/* Diagonal stripes pattern */}
                <svg className="sr-only">
                  <defs>
                    <pattern
                      id="stripes"
                      patternUnits="userSpaceOnUse"
                      width="5"
                      height="5"
                      patternTransform="rotate(135)"
                    >
                      <line
                        className="stroke-current text-slate-200 dark:text-slate-700 opacity-50"
                        x1="0"
                        y="0"
                        x2="0"
                        y2="5"
                        strokeWidth="2"
                      />
                    </pattern>
                  </defs>
                </svg>
                {/* Empty cells (previous month) */}
                {startingBlankDays.map((blankday) => {
                  return (
                    <div
                      className="bg-slate-50 dark:bg-slate-800 h-20 sm:h-28 lg:h-36"
                      key={blankday}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                      >
                        <rect width="100%" height="100%" fill="url(#stripes)" />
                      </svg>
                    </div>
                  );
                })}
                {/* Days of the current month */}
                {daysInMonth.map((day) => {
                  return (
                    <div
                      className="relative bg-white dark:bg-slate-800 h-20 sm:h-28 lg:h-36 overflow-hidden"
                      key={day}
                    >
                      <div className="h-full flex flex-col justify-between">
                        {/* Events */}
                        <div className="grow flex flex-col relative p-0.5 sm:p-1.5 overflow-hidden">
                          {getEvents(day).map((event) => {
                            return (
                              <Link
                                to={`/booking-order-details?id=${event.id}`}
                                className=""
                              >
                                <button
                                  className="relative w-full text-left mb-1"
                                  key={event.eventName}
                                >
                                  <div
                                    className={`px-2 py-0.5 rounded overflow-hidden ${eventColor(
                                      event.eventColor
                                    )}`}
                                  >
                                    {/* Event name */}
                                    <div className="text-xs font-semibold truncate">
                                      {event.eventName}
                                    </div>
                                    {/* Event time */}
                                    <div className="text-xs uppercase truncate hidden sm:block">
                                      {/* Start date */}
                                      {event.eventStart && (
                                        <span>
                                          {new Date(
                                            event.eventStart
                                          ).toLocaleTimeString([], {
                                            hour12: true,
                                            hour: "numeric",
                                            minute: "numeric",
                                          })}
                                        </span>
                                      )}
                                      {/* End date */}
                                      {event.eventEnd && (
                                        <span>
                                          -{" "}
                                          <span>
                                            {new Date(
                                              event.eventEnd
                                            ).toLocaleTimeString([], {
                                              hour12: true,
                                              hour: "numeric",
                                              minute: "numeric",
                                            })}
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              </Link>
                            );
                          })}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"
                            aria-hidden="true"
                          ></div>
                        </div>
                        {/* Cell footer */}
                        <div className="flex justify-between items-center p-0.5 sm:p-1.5">
                          {/* More button (if more than 2 events) */}
                          {getEvents(day).length > 2 && (
                            <button className="text-xs text-slate-500 dark:text-slate-300 font-medium whitespace-nowrap text-center sm:py-0.5 px-0.5 sm:px-2 border border-slate-200 dark:border-slate-700 rounded">
                              <span className="md:hidden">+</span>
                              <span>{getEvents(day).length - 2}</span>{" "}
                              <span className="hidden md:inline">more</span>
                            </button>
                          )}
                          {/* Day number */}
                          <button
                            className={`inline-flex ml-auto w-6 h-6 items-center justify-center text-xs sm:text-sm dark:text-slate-300 font-medium text-center rounded-full hover:bg-indigo-100 dark:hover:bg-slate-600 ${
                              isToday(day) && "text-indigo-500"
                            }`}
                          >
                            {day}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Empty cells (next month) */}
                {endingBlankDays.map((blankday) => {
                  return (
                    <div
                      className="bg-slate-50 dark:bg-slate-800 h-20 sm:h-28 lg:h-36"
                      key={blankday}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                      >
                        <rect width="100%" height="100%" fill="url(#stripes)" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default BookingsCalendar;
