import express from "express";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile, 
} from "../controllers/user.controller.js";
import multer from "multer";

const router = express.Router();

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/upload_profile_picture", upload.single("profile_picture"), uploadProfilePicture);
router.post("/register", register);
router.post("/login", login);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.post("/update_profile_data", updateProfileData);
router.get("/user/get_all_user_profile", getAllUserProfile); 
router.get("/user/download_resume",)

export default router;
