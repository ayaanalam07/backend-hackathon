import express from 'express';
import { createPost, singleUserPost,getAllUsers,deleteSinglePost,editSinglePost } from '../controllers/product.controllers.js';
import { upload } from "../middleware/multer.middleware.js";
import authenticateUser from "../middleware/auth.middleware.js"

// routing
const router = express.Router();

router.post("/createPost", authenticateUser, upload.single("image"), createPost);
router.get("/singleUserPost/:id",singleUserPost)
router.delete("/deletePost/:userId/:productId",deleteSinglePost)
router.put("/editPost/:userId/:productId",editSinglePost)
router.get("/getAllProducts",getAllUsers)



// export route
export default router;