import { useState } from "react";
import {
  useDeleteEmployee,
  useGetEmployees,
  USER_API_ROUTES,
} from "../../api/usersApis";
import { Loader } from "../../components/Loader";
import { EmptyMessage } from "../../components/EmptyMessage";
import { AppButton } from "../../components";
import { Edit2, SearchNormal1, Trash } from "iconsax-react";
import { EmployeeForm } from "./EmployeeForm";
import DropdownEditMenu from "../../components/DropdownEditMenu";
import { capitalizeFirstLetter } from "../../utils/Utils";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { showToast } from "../../utils/logs";
import { useQueryClient } from "@tanstack/react-query";

export const Employees = () => {
  const { data: employees, isPending } = useGetEmployees();
  const { mutateAsync: deleteEmployeeAPI, isPending: deleteEmpLoading } =
    useDeleteEmployee();
  const queryClient = useQueryClient();
  const [employeeModal, setEmployeeModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [search, setSearch] = useState("");

  const onDeletePress = async () => {
    try {
      await deleteEmployeeAPI({ id: employee.id });
      showToast(`Employee is successfully deleted.`, "success");
      queryClient.invalidateQueries({
        queryKey: [USER_API_ROUTES.GET_EMPLOYEES],
      });
      setConfirmModal(false);
      setEmployee(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  let searchEmployees = search
    ? employees?.filter(
        (item) =>
          item.first_name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.phone.toLowerCase().includes(search.toLowerCase())
      )
    : employees;

  return (
    <div className="w-full h-full flex flex-1 flex-col gap-y-6">
      <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">
        Employees
      </h1>

      <div className="bg-semantic-background-backgroundPrimary flex flex-1 flex-col rounded-2xl shadow-md p-6 space-y-4">
        {/* Top actions */}
        <div className="flex lg:flex-row lg:items-center lg:justify-between flex-col gap-y-2">
          {/* Search */}
          <div className="lg:w-auto w-full flex flex-row items-center gap-x-4 px-4 h-[55px] rounded-full bg-semantic-background-backgroundSecondary">
            <SearchNormal1 className="text-semantic-content-contentInverseTertionary w-6 h-6" />
            <input
              placeholder="Search employee"
              className="h-full flex flex-1 bg-transparent placeholder-semantic-content-contentInverseTertionary text-body1 font-medium text-semantic-content-contentPrimary border-none focus:outline-none focus:ring-0 p-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Add new employee button */}
          <AppButton
            onClick={() => {
              setEmployee(null);
              setTimeout(() => {
                setEmployeeModal(true);
              }, 500);
            }}
            title="Add New Employee"
            className="lg:w-[244px] w-full"
          />
        </div>

        {isPending ? (
          <Loader />
        ) : searchEmployees?.length ? (
          <div className="relative w-full flex flex-col h-full overflow-scroll pb-2">
            <table className="w-full">
              <thead className="text-left text-body2 font-normal text-semantic-content-contentPrimary">
                <tr className="h-[50px] border-b border-semantic-background-backgroundTertionary">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-semantic-content-contentPrimary text-left divide-y divide-semantic-background-backgroundTertionary overflow-y-auto">
                {searchEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="font-normal text-body2 text-semantic-content-contentPrimary h-[50px]"
                  >
                    <td className="whitespace-nowrap">
                      <div className="text-left">{emp.first_name}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="text-left">{emp.email}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="text-left">{emp.phone}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="items-start">
                        <span
                          className={`rounded-full ${
                            emp.status !== "ACTIVE"
                              ? "bg-semanticExtensions-background-backgroundNegative"
                              : "bg-semanticExtensions-background-backgroundPositive"
                          } text-semantic-content-contentInversePrimary text-caption2 font-normal py-[4px] px-2`}
                        >
                          {capitalizeFirstLetter(emp.status)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left">
                        {capitalizeFirstLetter(emp.roles[0])}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <DropdownEditMenu
                        className="relative inline-flex font-normal text-body1 text-semantic-content-contentPrimary"
                        align="right"
                      >
                        <button
                          onClick={() => {
                            setEmployee(emp);
                            setTimeout(() => {
                              setEmployeeModal(true);
                            }, 500);
                          }}
                          className="flex py-2 px-3 items-center gap-x-2"
                        >
                          <Edit2 size={16} />
                          <p>Edit</p>
                        </button>
                        <button
                          onClick={() => {
                            setEmployee(emp);
                            setTimeout(() => {
                              setConfirmModal(true);
                            }, 500);
                          }}
                          className="flex py-2 px-3 items-center gap-x-2"
                        >
                          <Trash size={16} />
                          <p>Delete</p>
                        </button>
                      </DropdownEditMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyMessage message="There are no employees" />
        )}
      </div>

      <EmployeeForm
        employee={employee}
        setEmployee={setEmployee}
        modalOpen={employeeModal}
        setModalOpen={setEmployeeModal}
      />
      <ConfirmationModal
        title={`Delete Employee`}
        subtitle={`Are you sure to delete this employee?`}
        modalOpen={confirmModal}
        setModalOpen={setConfirmModal}
        loading={deleteEmpLoading}
        onNoPress={() => {
          setConfirmModal(!confirmModal);
          setEmployee(null);
        }}
        onYesPress={onDeletePress}
      />
    </div>
  );
};
