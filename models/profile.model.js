import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  fieldOfStudy: {
    type: String,
    required: true,
  },
});

const workSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  years: {
    type: Number,
    required: true,
  },
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  currentPost: {
    type: String,
    required: true,
  },
  pastWork: {
    type: [workSchema], 
    required: true,
  },
  workExperience: {
    type: [workSchema],
  },
  education: {
    type: [educationSchema],
    required: true,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
