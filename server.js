import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import postRoute from "./routes/posts.routes.js"; 
import userRoutes from "./routes/users.routes.js";

dotenv.config();
const app = express();

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use(express.static("uploads")); 

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Linkedin";
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use(postRoute);
app.use(userRoutes);

// Welcome Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
