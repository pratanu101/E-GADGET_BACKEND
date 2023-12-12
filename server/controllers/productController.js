const productModel=require('../models/productModel');
const orderModel=require('../models/orderModel');
const fs=require('fs');
const slugify=require('slugify');

const createProductController=async(req,res)=>{
    try {
        const { name, description, price, quantity, shipping } =req.fields;
        const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
        
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
          });
    }
}

// get product 
const getProductController=async(req,res)=>{
      try {
        const products=await productModel.find({})
        .select("-photo")
        .limit(12)
        .sort({createdAt:-1});
        res.status(200).send({
          success:true,
          message:"allproducts",
          products
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          success:false,
          message:'error in get products',
          error:error.message
        })
      }
}

// update product
const updateProductController=async(req,res)=>{
  try {
    const { name, description, price, quantity, shipping } =req.fields;
    const { photo } = req.files;
//validation
switch (true) {
  case !name:
    return res.status(500).send({ error: "Name is Required" });
  case !description:
    return res.status(500).send({ error: "Description is Required" });
  case !price:
    return res.status(500).send({ error: "Price is Required" });
    
  case !quantity:
    return res.status(500).send({ error: "Quantity is Required" });
  case photo && photo.size > 1000000:
    return res
      .status(500)
      .send({ error: "photo is Required and should be less then 1mb" });
}

const products = await productModel.findByIdAndUpdate(
  req.params.pid,
  { ...req.fields, slug: slugify(name) },
  {new:true}
)
if (photo) {
  products.photo.data = fs.readFileSync(photo.path);
  products.photo.contentType = photo.type;
}
await products.save();
res.status(201).send({
  success: true,
  message: "Product Updated Successfully",
  products,
});
} catch (error) {
    console.log(error)
    res.status(500).send({
        success: false,
        error,
        message: "Error in Update product",
      });
}
}

// single product

const getSingleProductController=async(req,res)=>{
    try {
      const product=await productModel.findById({'_id':req.params.id}).select("-photo");
      res.status(200).send({
        success:true,
        message:"product get done",
        product
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:'error in get Product Details',
        error:error.message
      })
    }
}

// get photo

const productPhotoController=async(req,res)=>{
    try {
      const product=await productModel.findById(req.params.pid).select("photo");
      if(product.photo.data){
        res.set('Content-type',product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error)
    }
}

// delete product

const deleteProductController=async(req,res)=>{
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
}

// order product
const orderProductController=async(req,res)=>{
    try {
      const {cart}=req.body;
      const order=new orderModel({
        products:cart,
        buyer:req.user._id
      }).save();
      
      res.json({ok:true})

    } catch (error) {
      console.log(error);

    }
}





module.exports={
    createProductController,
    getProductController,
    updateProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    orderProductController
}