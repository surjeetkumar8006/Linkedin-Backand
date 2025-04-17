import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js"; 
export const activeCheck = async (req, res) => {
  return res.status(200).json({
    message: "Running",
  });
};
export const createPost = async (req, res) => {
  const { token, body } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    let fileType;
    const mimeType = req.file?.mimetype || "";

    if (mimeType.startsWith("image")) fileType = "image";
    else if (mimeType.startsWith("video")) fileType = "video";
    else if (mimeType.startsWith("audio")) fileType = "audio";
    else if (mimeType.includes("pdf") || mimeType.includes("doc")) fileType = "document";

    const newPost = new Post({
      userId: user._id,
      body: body || "",
      media: req.file?.filename || "",
      ...(fileType && { fileType }), 
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });

  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Get Posts Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    

    if (!token || !post_id) {
      return res.status(400).json({ message: "Token and post_id are required" });
    }
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }
    await Post.findByIdAndDelete(post_id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
