import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({
    message: "Running"
  });
};

