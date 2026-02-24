import { StatCard } from "./StatCard";
import { RevenueGraph } from "./RevenueGraph";
import { BookingsPieChart } from "./BookingsPieChart";
import { useGetDashboardData } from "../../api/dashboardApis";
import { Loader } from "../../components/Loader";

export const Dashboard = () => {
  const { data: dashboardData, isPending } = useGetDashboardData();

  return (
    <div className="flex flex-1 flex-col gap-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">{`Dashboard`}</h1>
      </div>
      {isPending || !dashboardData ? (
        <Loader color={"#000"} />
      ) : (
        <>
          <div className="flex lg:flex-row lg:gap-x-4 flex-col gap-y-4">
            {dashboardData.bookingStats.map((stat, index) => (
              <StatCard key={index.toString()} stat={stat} />
            ))}
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary">{`Stats`}</h2>

            <div className="flex flex-col items-center lg:flex-row lg:gap-x-4 lg:items-start gap-y-4">
              <div className="flex flex-col lg:w-2/3 w-full bg-semantic-background-backgroundPrimary p-4 rounded-2xl shadow-md gap-y-6">
                <div className="flex items-center w-full justify-between">
                  <h4 className="font-semibold text-heading4 text-semantic-content-contentPrimary">{`Revenue`}</h4>
                </div>
                <RevenueGraph data={dashboardData.revenue} />
              </div>

              <div className="flex flex-col lg:flex-1 p-4 rounded-2xl shadow-md bg-semantic-background-backgroundPrimary w-full gap-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-heading4 text-semantic-content-contentPrimary">{`Bookings Overview`}</h4>
                </div>
                <BookingsPieChart data={dashboardData.pieChartData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
