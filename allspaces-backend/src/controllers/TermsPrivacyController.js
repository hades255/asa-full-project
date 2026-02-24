import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// ============= TERMS AND CONDITIONS =============

// Get Terms and Conditions
export const getTerms = async (req, res) => {
  try {
    const terms = await prisma.termsAndConditions.findUnique({
      where: { id: "singleton" },
    });

    if (!terms) {
      return res
        .status(404)
        .json({ message: "Terms and conditions not found" });
    }

    res.status(200).json(terms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Create Terms and Conditions (Delete old, create new)
export const createTerms = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Delete existing record if it exists
    await prisma.termsAndConditions.deleteMany({
      where: { id: "singleton" },
    });

    // Create new record
    const terms = await prisma.termsAndConditions.create({
      data: {
        id: "singleton",
        content,
      },
    });

    res.status(201).json({
      message: "Terms and conditions created successfully",
      terms,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Terms and Conditions
export const updateTerms = async (req, res) => {
  try {
    const { content } = req.body;

    const updateData = {};
    if (content !== undefined) updateData.content = content;

    const terms = await prisma.termsAndConditions.update({
      where: { id: "singleton" },
      data: updateData,
    });

    res.status(200).json({
      message: "Terms and conditions updated successfully",
      terms,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Terms and conditions not found" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Terms and Conditions
export const deleteTerms = async (req, res) => {
  try {
    await prisma.termsAndConditions.delete({
      where: { id: "singleton" },
    });

    res
      .status(200)
      .json({ message: "Terms and conditions deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Terms and conditions not found" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ============= PRIVACY POLICY =============

// Get Privacy Policy
export const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await prisma.privacyPolicy.findUnique({
      where: { id: "singleton" },
    });

    if (!policy) {
      return res.status(404).json({ message: "Privacy policy not found" });
    }

    res.status(200).json(policy);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Create Privacy Policy (Delete old, create new)
export const createPrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Delete existing record if it exists
    await prisma.privacyPolicy.deleteMany({
      where: { id: "singleton" },
    });

    // Create new record
    const policy = await prisma.privacyPolicy.create({
      data: {
        id: "singleton",
        content,
      },
    });

    res.status(201).json({
      message: "Privacy policy created successfully",
      policy,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Privacy Policy
export const updatePrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    const updateData = {};
    if (content !== undefined) updateData.content = content;

    const policy = await prisma.privacyPolicy.update({
      where: { id: "singleton" },
      data: updateData,
    });

    res.status(200).json({
      message: "Privacy policy updated successfully",
      policy,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Privacy policy not found" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Privacy Policy
export const deletePrivacyPolicy = async (req, res) => {
  try {
    await prisma.privacyPolicy.delete({
      where: { id: "singleton" },
    });

    res.status(200).json({ message: "Privacy policy deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Privacy policy not found" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
