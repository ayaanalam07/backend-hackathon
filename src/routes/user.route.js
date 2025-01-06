import express from "express"
import { register,login,logout,refresh } from "../controllers/user.controllers.js"
import { upload } from "../middleware/multer.middleware.js";

// routing
const router = express.Router()

router.post("/register", upload.single("image"), register);
router.post("/login",login)
router.post("/logout",logout)
router.post("/refreshToken",refresh)
// router.get("/image", allImage);




export default router