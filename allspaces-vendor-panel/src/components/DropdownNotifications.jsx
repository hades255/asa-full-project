import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

import NotificationIcon from '../images/notification-icon.svg'
import dashboardApis from '../api/dashboardApis';

function DropdownNotifications({
  align
}) {

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await dashboardApis.notifications();
        console.log("Final response notification => ", response);

        if (response.status === 200) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.log("error => ", error);
      }
    };

    // fetchNotifications();
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${dropdownOpen && 'bg-slate-200'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <img src={NotificationIcon} alt='Notifications' className='w-6 h-6' />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-[#182235] rounded-full"></div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-4">Notifications</div>
          <ul>
            {notifications.length > 0 ?
              <>
                {notifications.map((notification, index) => (
                  <li key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                    <Link
                      className="block py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/20"
                      to="#"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span className="block text-sm mb-2">📣 <span className="font-medium text-slate-800 dark:text-slate-100">{notification.message}</span></span>
                      <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">{notification.createdAt}</span>
                    </Link>
                  </li>
                ))}
              </> :
              <>
                <li className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <Link
                    className="block py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/20"
                    to="#"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      No Notifications found!
                    </span>
                  </Link>
                </li>
              </>
            }
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownNotifications;