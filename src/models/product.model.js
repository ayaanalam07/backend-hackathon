import mongoose from "mongoose";

// product schema 
const productSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description : {
            type: String,
            required: true
        },
        user: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        price : {
            type: Number,
            required: true
        },
        orderItems  : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Order'
        }],
        image : {
            type: String,
            required: [true, "image is required"]
        }
    },{
        timestamps: true
    })

// product model export
export default mongoose.model("Product", productSchema)