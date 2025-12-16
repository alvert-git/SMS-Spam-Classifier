// server.js
const express = require ('express')
const app = express();
const cors = require('cors')
const dotenv = require("dotenv");
const authRoute = require('./routes/authRoute');
const checkMessageRoute = require("./routes/checkMessageRoute")

dotenv.config();

// Middlewares
app.use(express.json());
app.use(cors()); // Configure CORS as needed

// Root route
app.get('/',(req,res)=>{
    res.send("Server is running");
})

// Auth routes
app.use('/api/auth', authRoute);
app.use('/api/checkmessage',checkMessageRoute)

const port = process.env.PORT || 9000;
app.listen(port,()=>{
    console.log(`Server Running in port ${port}...`);
})