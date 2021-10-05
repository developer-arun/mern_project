const User=require("../models/user");
const Order=require("../models/order");

exports.getUserByID=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        console.log(user);
        if(err){
            return res.status(400).json({
                error : "Some internal Error"
            });
        }
        if(!user){
            return res.status(400).json({
                error : "NO user with given ID"
            });
        }

        req.profile=user;
        next();
    });
}

exports.getUser=(req,res)=>{
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    res.json(req.profile);
}

exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new :true,userFindAndModify: false},
        (err,user)=>{
            if(err||!user){
                return res.status(400).json({
                    error: "Authorization Required"
                });
            }
            user.salt=undefined;
            user.encry_password=undefined;
            user.createdAt=undefined;
            user.updatedAt=undefined;
            res.json(user);
        }
    );
}

exports.userPurchasedList=(req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err||!order){
            return res.status(400).json({
                error :"no orders"
            })
        }
        return res.json(order);
    });
}

exports.pushOrderInPurchaseList=(req,res,next)=>{
    let purchases=[];
    req.body.order.products.forEach(function(item){
        purchases.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            amount: req.body.order.amount,
            transactionId: req.body.transactionId,
        });
    });
    //storing purchses in db
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases :purchases}},
        {new :true},
        (err,purchaseList)=>{
            if(err){
                return res.status(400).json({
                    error :"UNABLE TO FIND ORDERS"
                });
            }
            console.log(purchaseList);
        }
    )
    next();
}