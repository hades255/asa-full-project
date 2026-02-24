import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Get all categories with subcategories and mark user's selected preferences
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with categories, subcategories, and selection status
 */
export const getAllPreferences = async (req, res) => {
  try {
    // Get user's selected category preferences
    const userPreferences = await prisma.userCategoryPreference.findMany({
      where: { userId: req.user.id },
      select: { categoryId: true },
    });

    // Create a set of selected category IDs for efficient lookup
    const selectedCategoryIds = new Set(
      userPreferences.map((p) => p.categoryId)
    );

    // Get all root categories with their subcategories
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: {
          include: {
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
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    // Format the response with selection status - simplified for mobile
    const formattedCategories = categories.map((category) => {
      const groups = {};

      // Group subcategories by type for compatibility with old format
      category.subcategories.forEach((subcategory) => {
        const groupName = subcategory.type || "Other";

        if (!groups[groupName]) {
          groups[groupName] = [];
        }

        groups[groupName].push({
          id: subcategory.id,
          name: subcategory.title,
          group: groupName,
          selected: selectedCategoryIds.has(subcategory.id),
        });
      });

      // Also add the main category as an option
      const mainGroupName = category.type || "Main";
      if (!groups[mainGroupName]) {
        groups[mainGroupName] = [];
      }

      groups[mainGroupName].push({
        id: category.id,
        name: category.title,
        group: mainGroupName,
        selected: selectedCategoryIds.has(category.id),
      });

      return {
        id: category.id,
        name: category.title,
        groups,
      };
    });

    res.status(200).json({ categories: formattedCategories });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};

/**
 * Get all available preferences (hierarchical structure)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all preferences
 */
export const getAllAvailablePreferences = async (req, res) => {
  try {
    // Get all main preferences (parentId is null) with their sub-preferences
    const mainPreferences = await prisma.preference.findMany({
      where: { parentId: null },
      include: {
        subPreferences: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    // Format the response in hierarchical structure like seedPreferences
    const formattedPreferences = mainPreferences.map((mainPref) => ({
      id: mainPref.id,
      title: mainPref.title,
      icon: mainPref.icon,
      orderIndex: mainPref.orderIndex,
      subPreferences: mainPref.subPreferences.map((subPref) => ({
        id: subPref.id,
        title: subPref.title,
        icon: subPref.icon,
        orderIndex: subPref.orderIndex,
        parentId: subPref.parentId,
      })),
    }));

    res.status(200).json({
      success: true,
      data: formattedPreferences,
      message: "All preferences retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching all preferences:", error);
    res.status(500).json({
      message: "Error fetching all preferences",
      error: error.message,
    });
  }
};

/**
 * Get user's preferences
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user's preferences
 */
export const getMyPreferences = async (req, res) => {
  try {
    const preferences = await prisma.userCategoryPreference.findMany({
      where: { userId: req.user.id },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    // Format the response to match the old structure
    const formattedPreferences = preferences.map((pref) => ({
      id: pref.id,
      userId: pref.userId,
      categoryId: pref.categoryId,
      category: {
        id: pref.category.id,
        title: pref.category.title,
        type: pref.category.type,
        parentId: pref.category.parentId,
        parent: pref.category.parent,
      },
    }));

    res.status(200).json(formattedPreferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};

/**
 * Update user's category preferences
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
export const associateUserPreferences = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid params: categoryIds must be a non-empty array",
      });
    }

    // Verify all categories exist
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: {
        id: true,
        title: true,
        parentId: true,
      },
    });

    // Check if all requested categories were found
    if (categories.length !== categoryIds.length) {
      const foundIds = categories.map((cat) => cat.id);
      const notFoundIds = categoryIds.filter((id) => !foundIds.includes(id));

      return res.status(404).json({
        success: false,
        message: "Some categories were not found",
        notFoundIds,
      });
    }

    // Get current preferences
    const currentPreferences = await prisma.userCategoryPreference.findMany({
      where: { userId: req.user.id },
      select: { categoryId: true },
    });
    const currentCategoryIds = currentPreferences.map(
      (pref) => pref.categoryId
    );

    // Calculate differences
    const toAdd = categoryIds.filter((id) => !currentCategoryIds.includes(id));
    const toRemove = currentCategoryIds.filter(
      (id) => !categoryIds.includes(id)
    );

    // Begin a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete all existing preferences for this user
      await tx.userCategoryPreference.deleteMany({
        where: { userId: req.user.id },
      });

      // Create new preferences
      await tx.userCategoryPreference.createMany({
        data: categoryIds.map((categoryId) => ({
          userId: req.user.id,
          categoryId,
        })),
      });
    });

    // Get updated preferences with category info
    const updatedPreferences = await prisma.userCategoryPreference.findMany({
      where: { userId: req.user.id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            type: true,
            parentId: true,
          },
        },
      },
    });

    // Count main categories and subcategories
    const mainCategories = updatedPreferences.filter(
      (pref) => !pref.category.parentId
    );
    const subcategories = updatedPreferences.filter(
      (pref) => !!pref.category.parentId
    );

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      summary: {
        total: updatedPreferences.length,
        mainCategories: mainCategories.length,
        subcategories: subcategories.length,
        added: toAdd.length,
        removed: toRemove.length,
      },
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update preferences",
      error: error.message,
    });
  }
};

/**
 * Get categories by user's preferences - simplified for mobile
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user's preferred categories
 */
export const getPreferredCategories = async (req, res) => {
  try {
    // Get user's selected category preferences
    const userPreferences = await prisma.userCategoryPreference.findMany({
      where: { userId: req.user.id },
      include: {
        category: {
          include: {
            services: {
              select: {
                id: true,
                name: true,
              },
            },
            parent: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (userPreferences.length === 0) {
      return res.status(200).json({
        preferredCategories: [],
        message: "No category preferences found",
      });
    }

    // Format the response for mobile
    const formattedPreferences = userPreferences.map((pref) => ({
      id: pref.category.id,
      title: pref.category.title,
      type: pref.category.type,
      image: pref.category.image || null,
      isSubcategory: !!pref.category.parentId,
      parent: pref.category.parent,
      serviceCount: pref.category.services.length,
    }));

    return res.status(200).json({
      preferredCategories: formattedPreferences,
    });
  } catch (error) {
    console.error("Error fetching preferred categories:", error);
    return res.status(500).json({
      message: "Error fetching preferred categories",
      error: error.message,
    });
  }
};

/**
 * Create user preferences for multiple categories
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created preferences
 */
export const createUserPreference = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid params: categoryIds must be a non-empty array",
      });
    }

    // Verify all categories exist
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: {
        id: true,
        title: true,
        parentId: true,
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Check if all requested categories were found
    if (categories.length !== categoryIds.length) {
      const foundIds = categories.map((cat) => cat.id);
      const notFoundIds = categoryIds.filter((id) => !foundIds.includes(id));

      return res.status(404).json({
        success: false,
        message: "Some categories were not found",
        notFoundIds,
      });
    }

    // Get existing preferences to avoid duplicates
    const existingPreferences = await prisma.userCategoryPreference.findMany({
      where: {
        userId: req.user.id,
        categoryId: { in: categoryIds },
      },
      select: {
        categoryId: true,
      },
    });

    const existingCategoryIds = existingPreferences.map(
      (pref) => pref.categoryId
    );
    const newCategoryIds = categoryIds.filter(
      (id) => !existingCategoryIds.includes(id)
    );

    // Create new preferences for categories that don't already exist
    if (newCategoryIds.length > 0) {
      await prisma.userCategoryPreference.createMany({
        data: newCategoryIds.map((categoryId) => ({
          userId: req.user.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }

    // Get updated preferences with category info
    const updatedPreferences = await prisma.userCategoryPreference.findMany({
      where: {
        userId: req.user.id,
        categoryId: { in: categoryIds },
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            type: true,
            parentId: true,
            parent: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Preferences created successfully",
      summary: {
        added: newCategoryIds.length,
        alreadyExisted: existingCategoryIds.length,
        total: updatedPreferences.length,
      },
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error("Error creating preferences:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create preferences",
      error: error.message,
    });
  }
};

/**
 * Get user's preferences (new preference system)
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user's preferences
 */
export const getUserPreferences = async (req, res) => {
  try {
    const userPreferences = await prisma.userPreference.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        preferenceId: true,
      },
    });

    // Return just an array of preference IDs
    const preferenceIds = userPreferences.map((pref) => pref.preferenceId);

    res.status(200).json(preferenceIds);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({
      message: "Error fetching user preferences",
      error: error.message,
    });
  }
};

/**
 * Create user preferences
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created preferences
 */
export const createUserPreferences = async (req, res) => {
  try {
    const { preferenceIds } = req.body;

    if (
      !preferenceIds ||
      !Array.isArray(preferenceIds) ||
      preferenceIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid params: preferenceIds must be a non-empty array",
      });
    }

    // Verify all preferences exist
    const preferences = await prisma.preference.findMany({
      where: {
        id: { in: preferenceIds },
      },
      select: {
        id: true,
        title: true,
        parentId: true,
      },
    });

    // Check if all requested preferences were found
    if (preferences.length !== preferenceIds.length) {
      const foundIds = preferences.map((pref) => pref.id);
      const notFoundIds = preferenceIds.filter((id) => !foundIds.includes(id));

      return res.status(404).json({
        success: false,
        message: "Some preferences were not found",
        notFoundIds,
      });
    }

    // Get existing preferences to avoid duplicates
    const existingPreferences = await prisma.userPreference.findMany({
      where: {
        userId: req.user.id,
        preferenceId: { in: preferenceIds },
      },
      select: {
        preferenceId: true,
      },
    });

    const existingPreferenceIds = existingPreferences.map(
      (pref) => pref.preferenceId
    );
    const newPreferenceIds = preferenceIds.filter(
      (id) => !existingPreferenceIds.includes(id)
    );

    // Create new preferences for preferenceIds that don't already exist
    let createdPreferences = [];
    if (newPreferenceIds.length > 0) {
      const createData = newPreferenceIds.map((preferenceId) => ({
        userId: req.user.id,
        preferenceId,
      }));

      createdPreferences = await prisma.userPreference.createMany({
        data: createData,
        skipDuplicates: true,
      });
    }

    // Get all user preferences with preference details
    const allUserPreferences = await prisma.userPreference.findMany({
      where: {
        userId: req.user.id,
        preferenceId: { in: preferenceIds },
      },
      include: {
        preference: {
          select: {
            id: true,
            title: true,
            icon: true,
            parentId: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "User preferences created successfully",
      data: {
        added: newPreferenceIds.length,
        alreadyExisted: existingPreferenceIds.length,
        total: allUserPreferences.length,
        preferences: allUserPreferences,
      },
    });
  } catch (error) {
    console.error("Error creating user preferences:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user preferences",
      error: error.message,
    });
  }
};

/**
 * Update user preferences (replace existing preference)
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated preferences
 */
export const updateUserPreferences = async (req, res) => {
  try {
    const { preferenceIds } = req.body;

    if (!preferenceIds || !Array.isArray(preferenceIds)) {
      return res.status(400).json({
        success: false,
        message: "Invalid params: preferenceIds must be an array",
      });
    }

    // If preferenceIds is empty, remove all preferences
    if (preferenceIds.length === 0) {
      const deletedPreferences = await prisma.userPreference.deleteMany({
        where: { userId: req.user.id },
      });

      return res.status(200).json({
        success: true,
        message: "All user preferences removed",
        data: {
          removed: deletedPreferences.count,
          added: 0,
          total: 0,
        },
      });
    }

    // Verify all preferences exist
    const preferences = await prisma.preference.findMany({
      where: {
        id: { in: preferenceIds },
      },
      select: {
        id: true,
        title: true,
        parentId: true,
      },
    });

    // Check if all requested preferences were found
    if (preferences.length !== preferenceIds.length) {
      const foundIds = preferences.map((pref) => pref.id);
      const notFoundIds = preferenceIds.filter((id) => !foundIds.includes(id));

      return res.status(404).json({
        success: false,
        message: "Some preferences were not found",
        notFoundIds,
      });
    }

    // Get current preferences
    const currentPreferences = await prisma.userPreference.findMany({
      where: { userId: req.user.id },
      select: { preferenceId: true },
    });
    const currentPreferenceIds = currentPreferences.map(
      (pref) => pref.preferenceId
    );

    // Calculate differences
    const toAdd = preferenceIds.filter(
      (id) => !currentPreferenceIds.includes(id)
    );
    const toRemove = currentPreferenceIds.filter(
      (id) => !preferenceIds.includes(id)
    );

    // Begin a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Remove preferences that are no longer needed
      if (toRemove.length > 0) {
        await tx.userPreference.deleteMany({
          where: {
            userId: req.user.id,
            preferenceId: { in: toRemove },
          },
        });
      }

      // Add new preferences
      if (toAdd.length > 0) {
        const createData = toAdd.map((preferenceId) => ({
          userId: req.user.id,
          preferenceId,
        }));

        await tx.userPreference.createMany({
          data: createData,
          skipDuplicates: true,
        });
      }
    });

    // Get updated preferences with preference details
    const updatedPreferences = await prisma.userPreference.findMany({
      where: { userId: req.user.id },
      include: {
        preference: {
          select: {
            id: true,
            title: true,
            icon: true,
            parentId: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "User preferences updated successfully",
      data: {
        removed: toRemove.length,
        added: toAdd.length,
        total: updatedPreferences.length,
        preferences: updatedPreferences,
      },
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user preferences",
      error: error.message,
    });
  }
};
