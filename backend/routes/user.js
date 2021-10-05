const express=require('express');
const router=express.Router();

const { getUserByID,getUser,updateUser,userPurchasedList}=require('../controllers/user');
const {isSignedIn,isAdmin,isAuthenticated}=require('../controllers/auth');

router.param("userId",getUserByID);

router.get("/user/:userId",isSignedIn,isAuthenticated,getUser);

router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser);

router.get("order/user/:userId",isSignedIn,isAuthenticated,userPurchasedList);

module.exports=router;
