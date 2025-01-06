import express from 'express';
import { createOrder, getOrderList, getSingleOrder } from '../controllers/order.controllers.js';
import authenticateUser from "../middleware/auth.middleware.js"
const router = express.Router()

router.post("/orders",authenticateUser,createOrder)
router.get("/orders",authenticateUser,getOrderList)
router.get("/orders/:id",authenticateUser,getSingleOrder)



export default router;