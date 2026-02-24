import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contactUs.findMany();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Create a contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and Message are required" });
    }

    const contact = await prisma.contactUs.create({
      data: { name, email, subject, message },
    });

    res.status(201).json({ message: "Contact message submitted successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "RESOLVED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const contact = await prisma.contactUs.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ message: "Contact status updated successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
