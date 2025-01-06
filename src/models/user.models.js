import mongoose from "mongoose"
import bcrypt from "bcrypt"

//user models
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: [true, "email is required"] 
    },
    password : {
        type: String,
        required: [true, "password is required"]
    },  
    role: {
        type: String,
        default:"user",
        enum: ['user', 'admin'],
        required: true
    },
    products :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }],
    order: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order'
    }]},{
        timestamps: true
    }
)

//hash password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//export model
export default mongoose.model("User",userSchema)