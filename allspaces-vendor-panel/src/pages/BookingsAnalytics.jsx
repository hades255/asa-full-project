import React, { useEffect, useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FintechCard05 from "../partials/fintech/FintechCard05";
import FintechCard07 from "../partials/fintech/FintechCard07";
import FintechCard09 from "../partials/fintech/FintechCard09";
import { Link } from "react-router-dom";

import CalendarIcon from "../images/calendar-icon.svg";
import dashboardApis, {
  useGetDashboardAnalytics,
  useGetDashboardOrdersOverview,
  useGetDashboardStats,
} from "../api/dashboardApis";
import DashboardAnalytics from "../partials/dashboard/DashboardAnalytics";

function BookingsAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: analytics, isPending: analyticsLoading } =
    useGetDashboardAnalytics();
  const { data: stats, isPending: statsLoading } = useGetDashboardStats();
  const { data: ordersOverview, isPending: ordersLoading } =
    useGetDashboardOrdersOverview();

  if (analyticsLoading || statsLoading || ordersLoading) return null;

  // useEffect(() => {
  //   const fetchAnalytics = async () => {
  //     try {
  //       const response = await dashboardApis.analytics();

  //       if (response.status === 200) {
  //         setAnalytics(response.data);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   fetchAnalytics();
  // }, []);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await dashboardApis.stats();

  //       if (response.status === 200) {
  //         setStats(response.data.stats);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  // useEffect(() => {
  //   const fetchOrdersOverviewStats = async () => {
  //     try {
  //       const response = await dashboardApis.ordersOverviewStats();

  //       if (response.status === 200) {
  //         setOrderOverviewStats(response.data.bookingStats[0]);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   fetchOrdersOverviewStats();
  // }, []);

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
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Dashboard
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <Link to="/home/bookings-calendar">
                  <div className="w-14 h-14 rounded-full bg-black p-4">
                    <img src={CalendarIcon} alt="" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <DashboardAnalytics data={analytics.cancelled} />
              <DashboardAnalytics data={analytics.completed} />
              <DashboardAnalytics data={analytics.in_progress} />
              <DashboardAnalytics data={analytics.pending} />
              {/* <FintechCard07 data={stats.stats} />
              <FintechCard09 data={ordersOverview.bookingStats[0]} /> */}
            </div>
            {/* Table (Recent Expenses) */}
            <FintechCard05 />
          </div>
        </main>
      </div>
    </div>
  );
}

export default BookingsAnalytics;
