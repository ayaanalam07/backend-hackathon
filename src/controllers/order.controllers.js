import Order from "../models/order.model.js";
import User from "../models/user.models.js";
import Product from "../models/product.model.js";


//create order
 const createOrder = async (req, res) => {
    const { userId, productIds } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        //search for products in the database
        const products = await Product.find({ _id: { $in: productIds } });
        if (!products || products.length === 0) {
            res.status(404).json({ message: "Products not found" });
            return;
        }

        let totalPrice = 0;
        products.forEach((product) => {
            totalPrice += product.price;
        });

        const order = new Order({
            user: userId,
            products: productIds,
            totalPrice: totalPrice,
        });

        await order.save();

        res.status(201).json({ message: "Order created", order: order });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//get all orders
 const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("products");
        res.status(200).json({ orders: orders });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//get single order
 const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate("user").populate("products");
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({ order: order });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//update order
 const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const allowedStatuses = ["pending", "completed", "shipped"];
        if (!allowedStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status" });
            return;
        }

        const order = await Order.findByIdAndUpdate(orderId, { status: status }, { new: true });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json({ message: "Order updated", order: order });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//delete order
 const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json({ message: "Order deleted", order: order });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//exporting
export {createOrder , getAllOrders, getOrderById, updateOrderStatus, deleteOrder}