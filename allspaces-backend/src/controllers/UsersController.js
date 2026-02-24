import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const createUsersForVendor = async (req, res) => {
  console.log("create user API called...");
  console.log("req.body => ", req.body);

  const { name, phone, email, password, role, status } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        first_name: name,
        phone,
        email,
        password: hashedPassword,
        roles: { set: [role] },
        status: status || "ACTIVE",
        refresh_token: "",
        confirmed_at: new Date(),
        parent_id: req.user.id,
      },
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUsersForVendor = async (req, res) => {
  const { staff_id } = req.params;
  const { name, phone, email, password, role, status } = req.body;

  try {
    // Find the staff user and verify they belong to the current vendor
    const staff_user = await prisma.user.findFirst({
      where: {
        id: staff_id,
        parent_id: req.user.id,
      },
    });

    if (!staff_user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== staff_user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.first_name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (role) updateData.roles = { set: [role] };
    if (status) updateData.status = status;

    // Only hash and update password if provided
    if (password) {
      const hashedPassword = await hashPassword(password);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: staff_user.id },
      data: updateData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        roles: true,
        status: true,
        created_at: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteUsersForVendor = async (req, res) => {
  const { staff_id } = req.params;

  try {
    const staff_user = await prisma.user.findUnique({
      where: {
        id: staff_id,
        parent_id: req.user.id,
      },
    });
    if (!staff_user)
      return res.status(400).json({ message: "User not found!" });

    const user = await prisma.user.delete({
      where: {
        id: staff_user.id,
      },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        roles: true,
        status: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEmployeesForVendor = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { parent_id: req.user.id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        roles: true,
        status: true,
        created_at: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchEmployeesForVendor = async (req, res) => {
  try {
    const { keyword } = req.query;

    const users = await prisma.user.findMany({
      where: {
        parent_id: req.user.id,
        OR: [
          { first_name: { contains: keyword, mode: "insensitive" } },
          { last_name: { contains: keyword, mode: "insensitive" } },
          { email: { contains: keyword, mode: "insensitive" } },
          { phone: { contains: keyword } },
        ],
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        roles: true,
        status: true,
        created_at: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
