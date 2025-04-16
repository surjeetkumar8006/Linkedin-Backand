import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({
    message: "Running",
  });
};

export const createPost = async (req, res) => {
  const { token } = req.body;
  console.log("Received token:", token);  // Log the received token
  
  try {
    const user = await User.findOne({ token: token });
    console.log("Database token:", user ? user.token : "No user found");  // Log the token stored in the database
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    

    const mimeType = req.file ? req.file.mimetype : "";
    let fileType = "";
    if (mimeType.startsWith("image")) fileType = "image";
    else if (mimeType.startsWith("video")) fileType = "video";
    else if (mimeType.startsWith("audio")) fileType = "audio";
    else if (mimeType.includes("pdf") || mimeType.includes("doc"))
      fileType = "document";

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file ? req.file.filename : "",
      fileType: fileType,
    });
    console.log("Saving post...", post);
    await post.save();
    console.log("Post saved!");

    return res.status(201).json({ message: "Post Created Successfully", post });
  } catch (error) {
    console.error("Post creation error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All posts fetched successfully",
      posts: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
