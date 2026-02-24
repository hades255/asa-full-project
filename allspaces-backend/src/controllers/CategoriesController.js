import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Get all categories with their associated services
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all categories
 */
export const getAllCategories = async (req, res) => {
  try {
    // Check if we should include subcategories
    const { includeSubcategories = "false" } = req.query;
    const shouldIncludeSubcategories = includeSubcategories === "true";

    // Always get only root categories (those without parents) and active
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        subcategories: shouldIncludeSubcategories
          ? {
              where: {
                isActive: true,
              },
              orderBy: {
                orderIndex: "asc",
              },
            }
          : false,
        parent: shouldIncludeSubcategories,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

/**
 * Get a category by ID with associated services and profiles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with the category details
 */
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        services: true,
        subcategories: {
          where: {
            isActive: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        parent: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return res.status(500).json({
      message: "Error fetching category",
      error: error.message,
    });
  }
};

/**
 * Get categories by type with their associated services
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with categories of the specified type
 */
export const getCategoriesByType = async (req, res) => {
  const { type } = req.params;

  if (!type) {
    return res.status(400).json({ message: "Category type is required" });
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        type,
        isActive: true,
      },
      include: {
        services: true,
        profiles: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategories: {
          where: {
            isActive: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        parent: true,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error(`Error fetching categories of type ${type}:`, error);
    return res.status(500).json({
      message: "Error fetching categories by type",
      error: error.message,
    });
  }
};

/**
 * Get all categories with limited fields (id, title, type) and their services with only id and name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with simplified categories and services
 */
export const getCategoriesWithServices = async (req, res) => {
  try {
    // Get the sort parameter from query or use default "orderIndex"
    const { sortBy = "orderIndex", includeSubcategories = "false" } = req.query;
    const shouldIncludeSubcategories = includeSubcategories === "true";

    // Only allow specific fields for sorting to prevent injection
    const allowedSortFields = ["title", "type", "id", "orderIndex"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "orderIndex";

    // Always get only root categories (those without parents) and active
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        type: true,
        image: true,
        parentId: true,
        orderIndex: true,
        services: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: "asc", // Always sort services by name ascending
          },
        },
        subcategories: shouldIncludeSubcategories
          ? {
              where: {
                isActive: true,
              },
              select: {
                id: true,
                title: true,
                type: true,
                image: true,
                orderIndex: true,
                services: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: {
                orderIndex: "asc",
              },
            }
          : false,
        parent: shouldIncludeSubcategories
          ? {
              select: {
                id: true,
                title: true,
                type: true,
                orderIndex: true,
              },
            }
          : false,
      },
      orderBy: {
        [sortField]: "asc", // Sort categories by the selected field
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories with services:", error);
    return res.status(500).json({
      message: "Error fetching categories with services",
      error: error.message,
    });
  }
};

/**
 * Create a new category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with the created category
 */
export const createCategory = async (req, res) => {
  try {
    const { title, type, image, parentId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Category title is required" });
    }

    // Check if category with the same title already exists
    const existingCategory = await prisma.category.findFirst({
      where: { title },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this title already exists" });
    }

    // Validate parent category if provided
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        title,
        type,
        image,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        subcategories: true,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
};

/**
 * Update a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with the updated category
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, image, parentId } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent circular references - a category cannot be its own parent or descendant
    if (parentId) {
      // Check if the parentId is the same as the category id
      if (parentId === id) {
        return res
          .status(400)
          .json({ message: "A category cannot be its own parent" });
      }

      // Check if the parentId is one of the category's descendants
      const isDescendant = await checkIfDescendant(id, parentId);
      if (isDescendant) {
        return res.status(400).json({
          message:
            "A category cannot have one of its descendants as its parent",
        });
      }

      // Validate parent category
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }
    }

    // If title is being changed, check if the new title already exists
    if (title && title !== category.title) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          title,
          NOT: { id },
        },
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category with this title already exists" });
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        title: title || category.title,
        type: type || category.type,
        image: image !== undefined ? image : category.image,
        parentId: parentId !== undefined ? parentId : category.parentId,
      },
      include: {
        parent: true,
        subcategories: true,
        services: true,
      },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

/**
 * Delete a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { reassignSubcategoriesTo } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        services: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the category has subcategories
    if (category.subcategories.length > 0) {
      // If reassignSubcategoriesTo is provided, validate it
      if (reassignSubcategoriesTo) {
        const targetCategory = await prisma.category.findUnique({
          where: { id: reassignSubcategoriesTo },
        });

        if (!targetCategory) {
          return res
            .status(400)
            .json({ message: "Target category for reassignment not found" });
        }

        // Reassign subcategories
        await prisma.category.updateMany({
          where: { parentId: id },
          data: { parentId: reassignSubcategoriesTo },
        });
      } else {
        // If no reassignment target provided, make subcategories root categories
        await prisma.category.updateMany({
          where: { parentId: id },
          data: { parentId: null },
        });
      }
    }

    // Check if the category has services
    if (category.services.length > 0) {
      // Update services to remove the category association
      await prisma.service.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      });
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

/**
 * Get subcategories for a specific parent category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with subcategories
 */
export const getSubcategories = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Check if parent category exists
    const parentCategory = await prisma.category.findUnique({
      where: { id: parentId },
    });

    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    // Get subcategories
    const subcategories = await prisma.category.findMany({
      where: {
        parentId,
        isActive: true,
      },
      include: {
        services: true,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return res.status(200).json(subcategories);
  } catch (error) {
    console.error(
      `Error fetching subcategories for parent ${req.params.parentId}:`,
      error
    );
    return res.status(500).json({
      message: "Error fetching subcategories",
      error: error.message,
    });
  }
};

/**
 * Get all root categories (categories without parents)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with root categories
 */
export const getRootCategories = async (req, res) => {
  try {
    const rootCategories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        subcategories: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            type: true,
            _count: {
              select: {
                subcategories: true,
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        services: true,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return res.status(200).json(rootCategories);
  } catch (error) {
    console.error("Error fetching root categories:", error);
    return res.status(500).json({
      message: "Error fetching root categories",
      error: error.message,
    });
  }
};

/**
 * Helper function to check if a category is a descendant of another category
 * @param {string} categoryId - The potential ancestor category ID
 * @param {string} potentialDescendantId - The potential descendant category ID
 * @returns {boolean} True if potentialDescendantId is a descendant of categoryId
 */
async function checkIfDescendant(categoryId, potentialDescendantId) {
  // Get all active subcategories of the category
  const subcategories = await prisma.category.findMany({
    where: {
      parentId: categoryId,
      isActive: true,
    },
    select: { id: true },
  });

  // Check if the potential descendant is a direct subcategory
  if (subcategories.some((sub) => sub.id === potentialDescendantId)) {
    return true;
  }

  // Recursively check each subcategory
  for (const sub of subcategories) {
    const isDescendant = await checkIfDescendant(sub.id, potentialDescendantId);
    if (isDescendant) {
      return true;
    }
  }

  return false;
}
