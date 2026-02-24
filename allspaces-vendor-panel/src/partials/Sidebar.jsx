import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import SidebarLinkGroup from './SidebarLinkGroup';
import AppLogo from '../images/logo.svg';
import HomeIcon from '../images/home-icon.svg';
import BookingsIcon from '../images/bookings-icon.svg';
import UserIcon from '../images/user-icon.svg';
import PrivacyPolicyIcon from '../images/privacy-policy-icon.svg';
import TermsConditionsIcon from '../images/terms-conditions-icon.svg';
import FaqIcon from '../images/faq-icon.svg';
import ContactSupportIcon from '../images/contact-support-icon.svg';
import CalendarIcon from '../images/calendar-icon.svg';
import { useAuth } from '../context/AuthContext';

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {

  const { user } = useAuth();
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/home/bookings-analytics" className="block">
            <img src={AppLogo} alt="Logo" className="w-24 h-24" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <ul className="mt-3">
              {user &&
                <>
                  {/* Home */}
                  <li className={`px-3 py-2 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/home/bookings-analytics') && 'bg-black'}`}>
                    <NavLink
                      end
                      to="/home/bookings-analytics"
                      className={`block text-slate-200 truncate transition duration-150 ${
                        pathname.includes('/home/bookings-analytics') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center ${pathname.includes('/home/bookings-analytics') ? 'text-white' : 'text-lightGray'}`}>
                        <img src={HomeIcon} alt="Home" className={`w-6 h-6 ${pathname.includes('/home/bookings-analytics') ? 'brightness-100' : 'brightness-50'}`} />
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Home
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/* Bookings Calendar */}
                  <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/home/bookings-calendar') && 'bg-black'}`}>
                    <NavLink
                      end
                      to="/home/bookings-calendar"
                      className={`block text-slate-200 truncate transition duration-150 ${
                        pathname.includes('/home/bookings-calendar') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center ${pathname.includes('/home/bookings-calendar') ? 'text-white' : 'text-lightGray'}`}>
                        <img src={CalendarIcon} alt="Home" className={`w-6 h-6 ${pathname.includes('/home/bookings-calendar') ? 'brightness-100' : 'brightness-50'}`} />
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Booking Calendar
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/* Bookings */}
                  <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/all-bookings') && 'bg-black'}`}>
                    <NavLink
                      end
                      to="/all-bookings"
                      className={`block text-slate-200 truncate transition duration-150 ${
                        pathname.includes('/all-bookings') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center ${pathname.includes('/all-bookings') ? 'text-white' : 'text-lightGray'}`}>
                        <img src={BookingsIcon} alt="Bookings" className={`w-6 h-6 ${pathname.includes('/all-bookings') ? 'brightness-100' : 'brightness-50'}`} />
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Bookings
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/* Users */}
                  <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/vendor/users') && 'bg-black'}`}>
                    <NavLink
                      end
                      to="/vendor/users"
                      className={`block text-slate-200 truncate transition duration-150 ${
                        pathname.includes('/vendor/users') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center ${pathname.includes('/vendor/users') ? 'text-white' : 'text-lightGray'}`}>
                        <img src={UserIcon} alt="Users" className={`w-6 h-6 ${pathname.includes('/vendor/users') ? 'brightness-100' : 'brightness-50'}`} />
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Users
                        </span>
                      </div>
                    </NavLink>
                  </li>
                </>
              }

              {/* Privacy Policy */}
              <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/privacy-policy') && 'bg-black'}`}>
                <NavLink
                  end
                  to="/privacy-policy"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('/privacy-policy') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${pathname.includes('/privacy-policy') ? 'text-white' : 'text-lightGray'}`}>
                    <img src={PrivacyPolicyIcon} alt="Privacy" className={`w-6 h-6 ${pathname.includes('/privacy-policy') ? 'brightness-100' : 'brightness-50'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Privacy Policy
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Terms & Conditions */}
              <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/terms-conditions') && 'bg-black'}`}>
                <NavLink
                  end
                  to="/terms-conditions"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('/terms-conditions') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${pathname.includes('/terms-conditions') ? 'text-white' : 'text-lightGray'}`}>
                    <img src={TermsConditionsIcon} alt="Terms" className={`w-6 h-6 ${pathname.includes('/terms-conditions') ? 'brightness-100' : 'brightness-50'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Terms & Conditions
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* FAQs */}
              <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/utility/faqs') && 'bg-black'}`}>
                <NavLink
                  end
                  to="/utility/faqs"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('/utility/faqs') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${pathname.includes('/utility/faqs') ? 'text-white' : 'text-lightGray'}`}>
                    <img src={FaqIcon} alt="FAQs" className={`w-6 h-6 ${pathname.includes('/utility/faqs') ? 'brightness-100' : 'brightness-50'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      FAQs
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Contact Support */}
              <li className={`px-3 py-2 mt-3 rounded-full mb-0.5 last:mb-0 ${pathname.includes('/contact-us') && 'bg-black'}`}>
                <NavLink
                  end
                  to="/contact-us"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('/contact-us') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${pathname.includes('/contact-us') ? 'text-white' : 'text-lightGray'}`}>
                    <img src={ContactSupportIcon} alt="Contacts" className={`w-6 h-6 ${pathname.includes('/contact-us') ? 'brightness-100' : 'brightness-50'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Contact Support
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;