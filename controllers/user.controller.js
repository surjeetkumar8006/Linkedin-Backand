import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

const userTokens = new Map(); // Temporary in-memory token store
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      active: true,
      createdAt: new Date(),
    });
    const newProfile = new Profile({
      userId: newUser._id,
      bio: "",
      currentPost: "",
      pastWork: [],
      workExperience: [],
      education: [],
    });
    await newProfile.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    userTokens.set(user._id.toString(), token); // Store token in memory

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;

    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture uploaded successfully" });
  } catch (err) {
    console.error("❌ Upload Profile Picture Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    // Check if the token exists in the in-memory store
    const userId = Array.from(userTokens.keys()).find(
      (key) => userTokens.get(key) === token
    );

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User profile updated successfully" });
  } catch (err) {
    console.error("❌ Update User Profile Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;

    // Check if the token exists in the in-memory store
    const userId = Array.from(userTokens.keys()).find(
      (key) => userTokens.get(key) === token
    );

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error("❌ Get User and Profile Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    // Check the token in the in-memory store (userTokens map)
    const userId = [...userTokens.entries()].find(
      ([key, value]) => value === token
    )?.[0];

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: userId });
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile with new data
    Object.assign(userProfile, newProfileData);
    await userProfile.save();

    return res.json({ message: "User profile updated successfully" });
  } catch (err) {
    console.error("❌ Update Profile Data Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getAllUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne()
      .populate('userId', 'name username profilePicture email'); 
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ profile }); 
  } catch (err) {
    return res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};


export const downloadProfile= async(req,res)=>{
  const user_id= req.query.id;
  try{
const userProfile= await Profile.findOne({userId:user_id}).populate('userId',"username,email, profilepicture");

let a = await convertUserDataToPDF(userProfile);
return res.json({a});


  }catch(err){

  }

}