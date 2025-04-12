import express from "express";
import { activeCheck } from "../controllers/post.controller.js";


const router = express.Router();

router.route("/").get(activeCheck);

export default router;
