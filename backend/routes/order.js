const express=require('express');
const router=express.Router();

const {isAdmin,isAuthenticated,isSignedIn}=require('../controllers/auth');
const {getUserByID,pushOrderInPurchaseList}=require("../controllers/user");
const {updateInventory}=require('../controllers/product');

const {getOrderById,getOrder,createOrder}=require('../controllers/order');

router.param("userId",getUserByID);
router.param("orderId",getOrderById);

router.get("/order/:orderId",getOrder);


module.exports=router;