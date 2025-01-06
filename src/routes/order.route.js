import express from "express";
import {createOrder,getAllOrders,getOrderById,updateOrderStatus,deleteOrder} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

export default router;
