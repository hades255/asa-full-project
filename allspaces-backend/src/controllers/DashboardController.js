import pkg from "@prisma/client";
const { PrismaClient, BookingStatus } = pkg;
import { endOfMonth, format, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentDate = new Date();
    const startOfMonthTime = startOfMonth(currentDate).toISOString();
    const endOfMonthTime = endOfMonth(currentDate).toISOString();

    // Fetch total spendings per booking status for ALL time (not just current month)
    const bookingData = await prisma.booking.groupBy({
      by: ["status"],
      where: {
        userId: userId,
      },
      _sum: { spend: true },
      _count: true,
    });

    // Get monthly data for all months (for graph)
    const monthlyPendingData = await prisma.$queryRaw`
      SELECT 
        date_trunc('month', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'PENDING'
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const monthlyInProgressData = await prisma.$queryRaw`
      SELECT 
        date_trunc('month', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'APPROVED'
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const monthlyCancelledData = await prisma.$queryRaw`
      SELECT 
        date_trunc('month', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'CANCELLED'
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const monthlyCompletedData = await prisma.$queryRaw`
      SELECT 
        date_trunc('month', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'COMPLETED'
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    // Get current month daily data (for current month graph)
    const currentMonthPendingData = await prisma.$queryRaw`
      SELECT 
        date_trunc('day', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'PENDING'
        AND created_at BETWEEN 
          ${startOfMonthTime}::timestamp
          AND ${endOfMonthTime}::timestamp
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const currentMonthInProgressData = await prisma.$queryRaw`
      SELECT 
        date_trunc('day', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'APPROVED'
        AND created_at BETWEEN 
          ${startOfMonthTime}::timestamp
          AND ${endOfMonthTime}::timestamp
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const currentMonthCancelledData = await prisma.$queryRaw`
      SELECT 
        date_trunc('day', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'CANCELLED'
        AND created_at BETWEEN 
          ${startOfMonthTime}::timestamp
          AND ${endOfMonthTime}::timestamp
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const currentMonthCompletedData = await prisma.$queryRaw`
      SELECT 
        date_trunc('day', created_at) AS grouped_date,
        SUM(spend) AS total_spend
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'COMPLETED'
        AND created_at BETWEEN 
          ${startOfMonthTime}::timestamp
          AND ${endOfMonthTime}::timestamp
      GROUP BY grouped_date
      ORDER BY grouped_date ASC;
    `;

    const pendingBooking = bookingData.find(
      (b) => b.status === BookingStatus.PENDING
    );
    const inProgressBooking = bookingData.find(
      (b) => b.status === BookingStatus.APPROVED
    );
    const completedBooking = bookingData.find(
      (b) => b.status === BookingStatus.COMPLETED
    );
    const cancelledBooking = bookingData.find(
      (b) => b.status === BookingStatus.CANCELLED
    );

    // Format response for graphical representation
    const response = {
      pending: {
        label: "Pending Bookings",
        count: pendingBooking?._count || 0,
        total_spend: pendingBooking?._sum.spend || 0,
        graph_data: monthlyPendingData,
        current_month_data: currentMonthPendingData,
      },
      in_progress: {
        label: "Upcoming Bookings",
        count: inProgressBooking?._count || 0,
        total_spend: inProgressBooking?._sum.spend || 0,
        graph_data: monthlyInProgressData,
        current_month_data: currentMonthInProgressData,
      },
      completed: {
        label: "Completed Bookings",
        count: completedBooking?._count || 0,
        total_spend: completedBooking?._sum.spend || 0,
        graph_data: monthlyCompletedData,
        current_month_data: currentMonthCompletedData,
      },
      cancelled: {
        label: "Cancelled Bookings",
        count: cancelledBooking?._count || 0,
        total_spend: cancelledBooking?._sum.spend || 0,
        graph_data: monthlyCancelledData,
        current_month_data: currentMonthCancelledData,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get current month completed bookings count
    const currentMonthBookings = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE status = 'COMPLETED'
        AND "userId" = ${req.user.id}
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    // Get previous month completed bookings count for percentage calculation
    const previousMonthBookings = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE status = 'COMPLETED'
        AND "userId" = ${req.user.id}
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get graph data for last 6 months
    const graphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "check_in") AS month,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE status = 'COMPLETED'
        AND "userId" = ${req.user.id}
        AND "check_in" >= DATE_TRUNC('month', NOW()) - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC;
    `;

    const currentCount = currentMonthBookings[0]?.count || 0;
    const previousCount = previousMonthBookings[0]?.count || 0;

    // Calculate percentage change
    let percentage = "0%";
    if (previousCount > 0) {
      const change = ((currentCount - previousCount) / previousCount) * 100;
      percentage =
        change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
    } else if (currentCount > 0) {
      percentage = "+100%";
    }

    // Format the response according to the new structure
    const response = {
      key: "1",
      title: "Completed Bookings",
      value: currentCount.toString().padStart(2, "0"),
      percentage: percentage,
      graphData: graphData.map((item) => ({
        date: format(new Date(item.month), "MMM yyyy"),
        bookings: item.bookings_count || 0,
      })),
    };

    console.log("Dashboard Stats => ", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getRevenueStats = async (req, res) => {
  try {
    // Get graph data for last 6 months revenue
    const graphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "check_in") AS month,
        COALESCE(SUM(spend), 0)::DECIMAL AS total_revenue
      FROM "Booking"
      WHERE "userId" = ${req.user.id}
        AND "check_in" >= DATE_TRUNC('month', NOW()) - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC;
    `;

    // Format the response with simple data array
    const data = graphData.map((item) => ({
      month: format(new Date(item.month), "MMM yyyy"),
      revenue: parseFloat(item.total_revenue || 0),
    }));

    console.log("Revenue Stats => ", { data });

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get Pending bookings (status = PENDING) for current month
    const currentMonthPending = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'PENDING'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    const previousMonthPending = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'PENDING'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get Confirmed bookings (status = APPROVED) for current month
    const currentMonthConfirmed = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'APPROVED'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    const previousMonthConfirmed = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'APPROVED'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get In Progress bookings (status = IN_PROGRESS) for current month
    const currentMonthInProgress = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'IN_PROGRESS'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    const previousMonthInProgress = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'IN_PROGRESS'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get Upcoming bookings (check_in >= current date) for current month
    const currentMonthUpcoming = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND "check_in" >= NOW()
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    const previousMonthUpcoming = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND "check_in" >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get Completed bookings (status = COMPLETED) for current month
    const currentMonthCompleted = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'COMPLETED'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    const previousMonthCompleted = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'COMPLETED'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get Cancelled bookings (status = CANCELLED) for current month
    const currentMonthCancelled = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'CANCELLED'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW());
    `;

    const previousMonthCancelled = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'CANCELLED'
        AND DATE_TRUNC('month', "check_in") = DATE_TRUNC('month', NOW()) - INTERVAL '1 month';
    `;

    // Get graph data for each status (last 30 days)
    const pendingGraphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "check_in") AS day,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'PENDING'
        AND "check_in" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC;
    `;

    const confirmedGraphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "check_in") AS day,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'APPROVED'
        AND "check_in" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC;
    `;

    const inProgressGraphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "check_in") AS day,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'IN_PROGRESS'
        AND "check_in" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC;
    `;

    const upcomingGraphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "check_in") AS day,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND "check_in" >= NOW()
        AND "check_in" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC;
    `;

    const completedGraphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "check_in") AS day,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'COMPLETED'
        AND "check_in" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC;
    `;

    const cancelledGraphData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "check_in") AS day,
        COUNT(*)::INTEGER AS bookings_count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND status = 'CANCELLED'
        AND "check_in" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC;
    `;

    // Get revenue data for last 6 months
    const revenueData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "check_in") AS month,
        COALESCE(SUM(spend), 0)::DECIMAL AS total_revenue
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND "check_in" >= DATE_TRUNC('month', NOW()) - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC;
    `;

    // Get total booking counts by status for last 6 months (for pie chart)
    const totalBookingStats = await prisma.$queryRaw`
      SELECT 
        status,
        COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND "check_in" >= DATE_TRUNC('month', NOW()) - INTERVAL '6 months'
      GROUP BY status;
    `;

    // Get upcoming bookings count for last 6 months (for pie chart)
    const upcomingBookingsCount = await prisma.$queryRaw`
      SELECT COUNT(*)::INTEGER AS count
      FROM "Booking"
      WHERE "userId" = ${userId}
        AND "check_in" >= NOW()
        AND "check_in" >= DATE_TRUNC('month', NOW()) - INTERVAL '6 months';
    `;

    // Helper function to calculate percentage change
    const calculatePercentage = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? "+100%" : "0%";
      }
      const change = ((current - previous) / previous) * 100;
      const roundedChange = Math.round(change);

      if (roundedChange === 0) {
        return "0%";
      }
      return roundedChange > 0 ? `+${roundedChange}%` : `${roundedChange}%`;
    };

    // Helper function to format graph data with all 30 days
    const formatGraphData = (data) => {
      const result = [];
      const now = new Date();

      for (let i = 29; i >= 0; i--) {
        const dayDate = new Date(now);
        dayDate.setDate(now.getDate() - i);
        const dayStr = format(dayDate, "MMM dd");

        const foundData = data.find((item) => {
          const itemDay = format(new Date(item.day), "MMM dd");
          return itemDay === dayStr;
        });

        result.push({
          date: dayStr,
          bookings: foundData ? foundData.bookings_count || 0 : 0,
        });
      }

      return result;
    };

    // Create booking stats cards (6 cards with specific logic)
    const bookingStats = [
      {
        key: "1",
        title: "Pending Bookings",
        value: (currentMonthPending[0]?.count || 0).toString().padStart(2, "0"),
        percentage: calculatePercentage(
          currentMonthPending[0]?.count || 0,
          previousMonthPending[0]?.count || 0
        ),
        isIncrease:
          (currentMonthPending[0]?.count || 0) >
          (previousMonthPending[0]?.count || 0),
        graphData: formatGraphData(pendingGraphData),
      },
      {
        key: "2",
        title: "Confirmed Bookings",
        value: (currentMonthConfirmed[0]?.count || 0)
          .toString()
          .padStart(2, "0"),
        percentage: calculatePercentage(
          currentMonthConfirmed[0]?.count || 0,
          previousMonthConfirmed[0]?.count || 0
        ),
        isIncrease:
          (currentMonthConfirmed[0]?.count || 0) >
          (previousMonthConfirmed[0]?.count || 0),
        graphData: formatGraphData(confirmedGraphData),
      },
      {
        key: "3",
        title: "In Progress Bookings",
        value: (currentMonthInProgress[0]?.count || 0)
          .toString()
          .padStart(2, "0"),
        percentage: calculatePercentage(
          currentMonthInProgress[0]?.count || 0,
          previousMonthInProgress[0]?.count || 0
        ),
        isIncrease:
          (currentMonthInProgress[0]?.count || 0) >
          (previousMonthInProgress[0]?.count || 0),
        graphData: formatGraphData(inProgressGraphData),
      },
      {
        key: "4",
        title: "Upcoming Bookings",
        value: (currentMonthUpcoming[0]?.count || 0)
          .toString()
          .padStart(2, "0"),
        percentage: calculatePercentage(
          currentMonthUpcoming[0]?.count || 0,
          previousMonthUpcoming[0]?.count || 0
        ),
        isIncrease:
          (currentMonthUpcoming[0]?.count || 0) >
          (previousMonthUpcoming[0]?.count || 0),
        graphData: formatGraphData(upcomingGraphData),
      },
      {
        key: "5",
        title: "Completed Bookings",
        value: (currentMonthCompleted[0]?.count || 0)
          .toString()
          .padStart(2, "0"),
        percentage: calculatePercentage(
          currentMonthCompleted[0]?.count || 0,
          previousMonthCompleted[0]?.count || 0
        ),
        isIncrease:
          (currentMonthCompleted[0]?.count || 0) >
          (previousMonthCompleted[0]?.count || 0),
        graphData: formatGraphData(completedGraphData),
      },
      {
        key: "6",
        title: "Cancelled Bookings",
        value: (currentMonthCancelled[0]?.count || 0)
          .toString()
          .padStart(2, "0"),
        percentage: calculatePercentage(
          currentMonthCancelled[0]?.count || 0,
          previousMonthCancelled[0]?.count || 0
        ),
        isIncrease:
          (currentMonthCancelled[0]?.count || 0) >
          (previousMonthCancelled[0]?.count || 0),
        graphData: formatGraphData(cancelledGraphData),
      },
    ];

    // Format revenue data - ensure all 6 months are included
    const revenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = format(monthDate, "MMM yyyy");

      const foundData = revenueData.find((item) => {
        const itemMonth = format(new Date(item.month), "MMM yyyy");
        return itemMonth === monthStr;
      });

      revenue.push({
        month: monthStr,
        revenue: foundData ? parseFloat(foundData.total_revenue || 0) : 0,
      });
    }

    // Format pie chart data - ensure all booking types are included
    const allStatuses = [
      "PENDING",
      "APPROVED",
      "IN_PROGRESS",
      "UPCOMING",
      "COMPLETED",
      "CANCELLED",
    ];
    const statusNames = {
      PENDING: "Pending Bookings",
      APPROVED: "Confirmed Bookings",
      IN_PROGRESS: "In Progress Bookings",
      UPCOMING: "Upcoming Bookings",
      COMPLETED: "Completed Bookings",
      CANCELLED: "Cancelled Bookings",
    };

    const pieChartData = allStatuses.map((status) => {
      if (status === "UPCOMING") {
        return {
          name: statusNames[status],
          value: upcomingBookingsCount[0]?.count || 0,
        };
      }

      const foundStat = totalBookingStats.find(
        (stat) => stat.status === status
      );
      return {
        name: statusNames[status],
        value: foundStat ? foundStat.count : 0,
      };
    });

    const response = {
      bookingStats,
      revenue,
      pieChartData,
    };

    console.log("Dashboard Data => ", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersOverviewStats = async (req, res) => {
  try {
    const bookingStats = await prisma.$queryRaw`
      SELECT 
        COUNT(*)::INTEGER AS total_count,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END)::INTEGER AS cancelled_count,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END)::INTEGER AS completed_count
      FROM "Booking"
      WHERE "userId" = ${req.user.id}
    `;

    console.log("Bookings => ", bookingStats);

    res.status(200).json({ bookingStats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
