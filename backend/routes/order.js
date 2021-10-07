const express=require('express');
const router=express.Router();

const {isAdmin,isAuthenticated,isSignedIn}=require('../controllers/auth');
const {getUserByID,pushOrderInPurchaseList}=require("../controllers/user");
const {updateInventory}=require('../controllers/product');

const {getOrderById,updateStatus,getOrderStatus,getAllOrders,createOrder}=require('../controllers/order');

router.param("userId",getUserByID);
router.param("orderId",getOrderById);


router.post('order/create/userId',
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateInventory,
    createOrder
);

router.get("/order/all/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAllOrders
);

router.get("/order/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getOrderStatus
);

router.put("/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateStatus
);


module.exports=router;