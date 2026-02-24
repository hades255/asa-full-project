import pkg from "@prisma/client";
const { PrismaClient, BookingStatus } = pkg;

const prisma = new PrismaClient();

export const globalSearch = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);

    const validStatuses = Object.values(BookingStatus);
    const statusFilter = validStatuses.includes(keyword.toUpperCase())
      ? { status: keyword.toUpperCase() }
      : undefined;

    // Search across multiple tables
    const [bookings, profiles, facilities, services] = await Promise.all([
      prisma.booking.findMany({
        where: {
          userId: req.user.id,
          ...(statusFilter ? { OR: [statusFilter] } : {}),
        },
        take,
        skip,
      }),
      prisma.profile.findMany({
        where: {
          userId: req.user.id,
          source: "SPACE",
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        },
        take,
        skip,
      }),
      prisma.facility.findMany({
        where: {
          name: { contains: keyword, mode: "insensitive" },
        },
        take,
        skip,
      }),
      prisma.service.findMany({
        where: {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        },
        take,
        skip,
      }),
    ]);

    const results = [
      ...bookings.map((b) => ({
        type: "Booking",
        description: `Find a Booking against your search ${keyword}`,
        id: b.id,
      })),
      ...profiles.map((p) => ({
        type: "Profile",
        description: `Find a Profile against your search ${keyword}`,
        id: p.id,
      })),
      ...facilities.map((f) => ({
        type: "Facility",
        description: `Find a Facility against your search ${keyword}`,
        id: f.id,
      })),
      ...services.map((s) => ({
        type: "Service",
        description: `Find a Service against your search ${keyword}`,
        id: s.id,
      })),
    ];

    return res.json({
      results,
    });
  } catch (error) {
    console.error("Error in global search:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
