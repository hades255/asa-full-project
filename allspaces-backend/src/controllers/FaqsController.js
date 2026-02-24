import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Get all FAQs
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Create FAQ
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Question and Answer are required" });
    }

    const faq = await prisma.fAQ.create({
      data: { question, answer },
    });

    res.status(201).json({ message: "FAQ created successfully", faq });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await prisma.fAQ.update({
      where: { id },
      data: { question, answer },
    });

    res.status(200).json({ message: "FAQ updated successfully", faq });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.fAQ.delete({
      where: { id },
    });

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
