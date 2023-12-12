const express=require('express');
const cors=require('cors');
const env=require('dotenv').config();
const connectDB=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes');

const PORT=process.env.PORT || 8080;
const morgan=require('morgan');

connectDB()

const app=express();
// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/product',productRoutes);



app.get('/',(req,res)=>{
    res.send('welcome to ecomm app')
})

app.listen(PORT,()=>{
    console.log(`Server has started at port ${PORT}`);
})