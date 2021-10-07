const {Order,ProductCart}=require('../models/order');

exports.getOrderById=(req,res,next,id)=>{
    Order.findById(id)
        .populate("products.product","name price")
        .exec(
            (err,order)=>{
                if(err){
                    return res.status(400).json({
                        error:"Error while finding order in db"
                    });
                }
                req.order=order;
                next();
            }
    );
}

exports.getOrder=(req,res)=>{

}