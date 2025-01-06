import express from 'express'
import dotenv from "dotenv";
import connectDB from './src/db/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import UserRouter from "./src/routes/user.route.js"
import ProductRouter from "./src/routes/product.route.js"
import OrderRouter from "./src/routes/order.route.js"

dotenv.config()


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/auth", UserRouter)
app.use("/products", ProductRouter)
app.use("/orders", OrderRouter)



app.get("/", (req, res) => {
  res.send("Hello World!");
});


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  })