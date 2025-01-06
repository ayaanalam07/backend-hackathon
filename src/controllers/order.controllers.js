import Users from "../models/user.models.js"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"



//customer create order
const createOrder = async (req,res)=>{
    const {id,quantity} = req.body
    const userId = req.user.id;

    const user = await Users.findById(userId)
    if(!user) return res.status(404).json({message:"User not found"})
     if (user.role !== "customer") {
            return res.status(403).json({ message: "Unauthorized: Only customers can place orders" });
    }

    try {
        const product = await Product.findById(id)
    if(!product) return res.status(404).json({message:"Product not found"})

    const totalPrice = product.price * quantity
    const order = await Order.create({
        user: userId,
        products: [id],
        quantity,
        totalPrice,
        status: "Order Done"
    })
    
    await user.save()
    await user.updateOne({
        $push: {orders: order._id}
    })


    const productOwner = await Users.findById(product.user); 
    if (productOwner) {
        await productOwner.updateOne({
            $push: { orders: order._id }
        });
    }


    res.status(200).json({
        message:"Order created successfully",
        order
    })
    } catch (error) {
        console.log(error);
        
    }


}

//get order list
const getOrderList = async (req,res)=>{
   try {
    const userId = req.user.id;
    const user = await Users.findById(userId).populate("orders")
    if(!user) return res.status(404).json({message:"User not found"})
    
    res.status(200).json({
        message:"Order list",
        orders: user.orders
    })
   } catch (error) {
    console.log(error);
    
   }
}

//get single order
const getSingleOrder = async (req,res)=>{
   try {
    const {id} = req.params;
    const user = await Order.findById(id).populate("products")
    if(!user) return res.status(404).json({message:"User not found"})

    res.status(200).json({
        message:"Single order",
        order: user
    })
   } catch (error) {
    console.log(error);
    
   }
    
}

export {createOrder,getOrderList,getSingleOrder}