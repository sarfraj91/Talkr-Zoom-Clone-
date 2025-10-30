import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide username and password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Register first!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
    }

    const token = crypto.randomBytes(16).toString("hex");
    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({ message: "Login successful", token });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong during login: ${err.message}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (!name || !username || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields are required" });
    }

    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashPassword });

    await newUser.save();
    res.status(httpStatus.CREATED).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong during registration: ${err.message}` });
  }
};

export { login, register };
