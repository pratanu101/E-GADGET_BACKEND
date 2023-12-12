const express=require('express');
const {requireSignin, isAdmin}=require('../middlewares/authMiddleware');
const {
  orderProductController,
  createProductController,
  updateProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
} = require("../controllers/productController");
const router=express.Router();
const formidable=require('express-formidable');

// product Router
router.post("/create-product",requireSignin,isAdmin,formidable(),createProductController);

// get all product
router.get("/allproducts",getProductController);

// single product
router.get("/single-product/:id",getSingleProductController);

// update product
router.put(
  "/update-product/:pid",
  requireSignin,
  isAdmin,
  formidable(),
  updateProductController
);


//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/deleteproduct/:pid", deleteProductController);

// Buy Product
router.post("/product-buy",requireSignin, orderProductController);





module.exports=router;