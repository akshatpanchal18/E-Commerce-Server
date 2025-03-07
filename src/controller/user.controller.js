import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandeler from "../utils/asyncHandeler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { deleteImageFromCloudinaryByUrl } from "../utils/cloudinary.js";

const generateUserToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new apiError(500, "something went Wrong while genrate token");
  }
};

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
  maxAge: 10 * 24 * 60 * 60 * 1000,
};
const logoutOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
};

export const createUser = asyncHandeler(async (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    contact_no,
    password,
    address,
    city,
    zip_code,
  } = req.body;

  if (
    !username ||
    !first_name ||
    !last_name ||
    !email ||
    !contact_no ||
    !password ||
    !address ||
    !city ||
    !zip_code
  ) {
    throw new apiError(400, "All fields are required");
    // res.status(400).json(new apiError(400,"All fields are require"))
  }
  const existingUser = await User.findOne({
    $or: [{ "userInfo.email": email }, { "userInfo.contact_no": contact_no }],
  });

  if (existingUser) {
    if (existingUser.userInfo.email === email) {
      throw new apiError(409, "Email already exists");
      // res.status(409).json(new apiError(409,"Email already exists"))
    }
    if (existingUser.userInfo.contact_no === contact_no) {
      throw new apiError(409, "Contact number already exists");
      // res.status(409).json(new apiError(409,"contact no. already exists"))
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    userInfo: {
      username,
      first_name,
      last_name,
      email,
      contact_no,
      password: hashedPassword,
    },
    user_address: {
      address,
      city,
      zip_code,
    },
  });
  await newUser.save();

  res
    .status(201)
    .json(new apiResponse(201, newUser, "User created successfully"));
});

export const userLogin = asyncHandeler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "email or password missing");
  }
  const findUser = await User.findOne({ "userInfo.email": email });
  if (!findUser) {
    throw new apiError(404, "User not found");
    // res.status(404).json(new apiError(404,"User not found"))
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    findUser.userInfo.password
  );
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
    // res.status(401).json(new apiError(401,"Inavalid Password"))
  }

  const { accessToken } = await generateUserToken(findUser._id);
  res
    .status(200)
    // .clearCookie("userToken") // Clear previous user token
    .cookie("userToken", accessToken, options)
    .json(new apiResponse(200, findUser, "user logged in successfully"));
});
export const adminLogin = asyncHandeler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "email or password missing");
  }
  const findUser = await User.findOne({ "userInfo.email": email });
  if (!findUser) {
    throw new apiError(404, "User not found");
    // res.status(404).json(new apiError(404,"User not found"))
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    findUser.userInfo.password
  );
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
    // res.status(401).json(new apiError(401,"Inavalid Password"))
  }
  const { accessToken } = await generateUserToken(findUser._id);
  res
    .status(200)
    // .clearCookie("AdminToken") // Clear previous admin token
    .cookie("AdminToken", accessToken, options)
    .json(new apiResponse(200, findUser, "Admin logged in successfully"));
});
export const userLogout = asyncHandeler(async (req, res) => {
  // const user_id = req.user?._id;
  // if (!user_id) {
  //   throw new apiError(404, "user not found");
  // }
  res
    .status(200)
    .clearCookie("userToken", logoutOptions)
    .json(new apiResponse(200, {}, "user logged out"));
});
export const adminLogout = asyncHandeler(async (req, res) => {
  // const user_id = req.user?._id;
  // if (!user_id) {
  //   throw new apiError(404, "user not found");
  // }
  res
    .status(200)
    .clearCookie("AdminToken", logoutOptions)
    .json(new apiResponse(200, {}, "user logged out"));
});

export const getCurrentUser = asyncHandeler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apiError(404, "User not found");
  }
  res.status(200).json(new apiResponse(200, user, "User found"));
});

export const verify = asyncHandeler(async (req, res) => {
  res.status(200).json({ message: "Verified" });
});
