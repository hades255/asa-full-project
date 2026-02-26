/**
 * GET /api/intent/categories
 * Returns categories with subcategories for filter UI.
 * Matches shape expected by AppFilters: { filters: { categories: [...] } }
 */

import { getPrisma } from "../lib/db.js";

export async function getCategories(req, res) {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      return res.status(200).json({
        filters: {
          categories: [],
        },
      });
    }

    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        subcategories: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            image: true,
            orderIndex: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    const filters = {
      categories: categories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        image: cat.image,
        subcategories: (cat.subcategories || []).map((sub) => ({
          id: sub.id,
          title: sub.title,
          image: sub.image,
        })),
      })),
    };

    return res.status(200).json({ filters });
  } catch (err) {
    console.error("Categories fetch error:", err);
    return res.status(500).json({
      message: "Failed to fetch categories",
      details: err.message || "Server error",
    });
  }
}
