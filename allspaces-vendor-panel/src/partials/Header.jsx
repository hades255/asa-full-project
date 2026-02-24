import React, { useEffect, useRef, useState } from "react";

import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import searchesApis from "../api/searchesApis";
import Transition from "../utils/Transition";

function Header({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Fetch search results (Debounced API call)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await searchesApis.globalSearchAPI(query);
        setResults(response.data.results);
        setDropdownOpen(true);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    };

    const debounceTimeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <header className="sticky top-0 bg-extraLightLight z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
            <div className="text-black">
              {user ? (
                <>
                  <p className="text-base font-normal">Welcome back,</p>
                  <h3 className="text-2xl font-semibold">
                    {user?.first_name || "Space User"}
                  </h3>
                </>
              ) : (
                <>
                  <p className="text-base font-normal">
                    Welcome back to Spaces
                  </p>
                </>
              )}
            </div>
          </div>

          {user && (
            <>
              {/* Header: Right side */}
              <div className="flex items-center space-x-3">
                {/* Search form */}
                <div className="relative w-full">
                  {/* Search Input */}
                  <form
                    className="relative h-11 flex items-center bg-[#E8E8E8] rounded-full p-4 gap-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.5 21.5C16.7467 21.5 21 17.2467 21 12C21 6.75329 16.7467 2.5 11.5 2.5C6.25329 2.5 2 6.75329 2 12C2 17.2467 6.25329 21.5 11.5 21.5Z"
                        stroke="#A6A6A6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 22.5L20 20.5"
                        stroke="#A6A6A6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      ref={trigger}
                      type="search"
                      placeholder="Search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray border-none focus:border-none focus:ring-0 focus:outline-none p-0"
                    />
                  </form>

                  {/* Search Results Dropdown */}
                  <Transition
                    className="origin-top-left absolute left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-50 max-h-96 overflow-y-auto border border-gray-300"
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
                      className="py-2 divide-y divide-solid divide-gray-300"
                    >
                      {results.length > 0 ? (
                        results.map((item, index) => (
                          <div
                            key={index}
                            className="p-3 cursor-pointer hover:bg-gray-100"
                            onClick={() => console.log("Selected:", item)}
                          >
                            <p className="text-xs">{`${item.type} - ${item.id}`}</p>
                            <p>{item.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  </Transition>
                </div>
                <Notifications align="right" />
                {/*  Divider */}
                <hr className="w-px h-6 bg-slate-200 dark:bg-slate-700 border-none" />
                <UserMenu align="right" />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
