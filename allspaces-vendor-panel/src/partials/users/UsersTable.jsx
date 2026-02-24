import React, { useState, useEffect } from "react";
import UsersTableItem from "./UsersTableItem";

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
import { Link } from "react-router-dom";
import usersApis, {
  useGetEmployees,
  useSearchEmployee,
} from "../../api/usersApis";

function UsersTable({ selectedItems }) {
  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [search, setSearch] = useState(null);

  const { data: employees, isPending: employeesloading } = useGetEmployees();
  const { mutateAsync: searchAPI, isPending: searchLoading } =
    useSearchEmployee();

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(list.map((li) => li.id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    selectedItems(isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 relative">
      <header className="flex justify-between items-center mb-4">
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
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22 22.5L20 20.5"
              stroke="#A6A6A6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchUserApi()}
            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray border-none focus:border-none focus:ring-0 focus:outline-none p-0"
          />
        </form>
        <Link
          to={"/vendor/users/new"}
          className="btn rounded-full bg-black text-base text-white font-medium shadow-sm transition duration-150 px-5 py-3"
        >
          Add New User
        </Link>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="font-normal text-body2 text-semantic-content-contentPrimary text-left">
              <tr className="h-10 border-b border-[#E8E8E8]">
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Phone</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal">Status</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Role</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Action</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm text-semantic-content-contentPrimary text-left divide-y divide-[#E8E8E8]">
              {employees?.length > 0 ? (
                employees?.map((employee) => {
                  return (
                    <UsersTableItem
                      key={employee.id}
                      id={employee.id}
                      name={employee.first_name}
                      email={employee.email}
                      phone={employee.phone}
                      roles={employee.roles}
                      status={employee.status}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(employee.id)}
                    />
                  );
                })
              ) : (
                <tr>
                  <td class="text-center py-8" colSpan="100%">
                    No user found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersTable;
