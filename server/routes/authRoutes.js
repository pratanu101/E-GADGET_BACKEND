const express=require('express');
const {requireSignin, isAdmin}=require('../middlewares/authMiddleware');

const {test,registerController,loginController,getOrderController}=require('../controllers/authController');
// making router object
const router=express.Router();


// ALL User Related Routes Start
router.get('/test',requireSignin,isAdmin,test)
// Register User Method POST
router.post('/register',registerController);

// Login User Method POST
router.post('/login',loginController);
// Auth-Route
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true})
});

// admin-route
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});

// get order
router.get('/orders',requireSignin,getOrderController);



module.exports=router;