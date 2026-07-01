import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { server } from "./socket/socket.js"
import "./app.js" // This imports and sets up the app middlewares

dotenv.config({
    path:'./.env'
})


connectDB()
.then( ()=>{
    server.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on ${process.env.PORT}`);
    })
} )

.catch( (error)=>{
    console.log("MongoDB Connection Failed",error);
} )
