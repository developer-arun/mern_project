const express=require('express');
const router=express.Router();

const {isSignedIn,isAdmin,isAuthenticated}=require('../controllers/auth');
const {getUserByID}=require('../controllers/user');
const {getProductById,getAllProducts,createProduct,getProduct,photo,removeProduct,updateProduct}=require('../controllers/product');

router.param("userId",getUserByID);
router.param("productId",getProductById);

router.post("/product/create/:userId",
        isSignedIn,
        isAuthenticated,
        isAdmin,
        createProduct);

router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);
router.get("/products",getAllProducts);

router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

router.delete("/product/:productId/:userId",
        isSignedIn,
        isAuthenticated,
        isAdmin,
        removeProduct);

module.exports=router;