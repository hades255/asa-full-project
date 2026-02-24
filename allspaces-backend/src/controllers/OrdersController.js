import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getOrdersOverview = async (req, res) => {
  try {
    // Get total count of bookings
    const totalBookings = await prisma.booking.count();

    if (totalBookings === 0) {
      return res.status(200).json({
        totalBookings: 0,
        statusBreakdown: [
          { label: "Completed", percentage: 0 },
          { label: "Cancelled", percentage: 0 },
        ],
      });
    }

    // Count completed and cancelled bookings
    const completedCount = await prisma.booking.count({
      where: { status: "COMPLETED" },
    });
    const cancelledCount = await prisma.booking.count({
      where: { status: "CANCELLED" },
    });

    // Calculate percentages
    const completedPercentage = (
      (completedCount / totalBookings) *
      100
    ).toFixed(2);
    const cancelledPercentage = (
      (cancelledCount / totalBookings) *
      100
    ).toFixed(2);

    res.status(200).json({
      totalBookings,
      statusBreakdown: [
        { label: "Completed", percentage: parseFloat(completedPercentage) },
        { label: "Cancelled", percentage: parseFloat(cancelledPercentage) },
      ],
    });
  } catch (error) {
    console.error("Error fetching orders overview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersList = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
            description: true,
            source: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform response to match the expected format
    const formattedOrders = bookings.map((booking) => ({
      id: booking.id,
      check_in: booking.check_in,
      time: booking.created_at, // Using created_at as time
      status: booking.status,
      amount: booking.amount,
      booking: {
        id: booking.id,
        check_in: booking.check_in,
        spend: booking.spend,
        status: booking.status,
      },
      user: booking.user,
      profile: booking.profile, // Adding profile information
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
