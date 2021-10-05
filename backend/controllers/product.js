const Product=require('../models/product');
const formidable=require('formidable');
const _=require('lodash');
const filesystem=require('fs');

exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec(
        (err,product)=>{
            if(err||!product){
                return res.status(400).json({
                    error : "Error while finding product"
                });
            }
            req.product=product;
            next();
        }
    );
}

exports.createProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;    

    form.parse(
        req,
        (err,fields,file)=>{

            if(err){
                return res.status(400).json({
                    error : "Image is not suitable"
                });
            }


            const {price,name,description,category,stock}=fields;
            console.log(fields);
            if(
                !name||!description||!category||!stock||!price
            ){
                return res.status(400).json({
                    error : "Fill all fields"
                });
            }

            let product=new Product(fields);
            
            //handle file
            if(file.photo){
                if(file.photo.size>3000000){
                    return res.status(400).json({
                        error : "File size shole be less than 3 mb"
                    });
                }
                product.photo.data=filesystem.readFileSync(file.photo.path);
                product.photo.contentType=file.photo.type;
            }

            //saving in db
            product.save(
                (err,product)=>{
                    if(err||!product){
                        res.status(400).json({
                            error : "Error saving in DB"
                        });
                    }
                    res.json(product);
                }
            )
            console.log(product);
        }
    );
}

exports.getProduct=(req,res)=>{
    req.product.photo=undefined;
    res.json(req.product);
}

exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.removeProduct=(req,res)=>{
    const product=req.product;
    product.remove(
        (err,product)=>{
            if(err){
                return res.status(400).json({
                    error: "error while removing product"
                });
            }
            res.json({
                message :`${product.name} is deleted from db`
            });
        }
    )
}

exports.updateProduct=(req,res)=>{
    
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;    

    form.parse(
        req,
        (err,fields,file)=>{

            if(err){
                return res.status(400).json({
                    error : "Image is not suitable"
                });
            }


            console.log(fields);

            let product=req.product;
            product=_.extend(product,fields);
            
            //handle file
            if(file.photo){
                if(file.photo.size>3000000){
                    return res.status(400).json({
                        error : "File size shole be less than 3 mb"
                    });
                }
                product.photo.data=filesystem.readFileSync(file.photo.path);
                product.photo.contentType=file.photo.type;
            }

            //saving in db
            product.save(
                (err,product)=>{
                    if(err||!product){
                        res.status(400).json({
                            error : "Error updating in DB"
                        });
                    }
                    res.json(product);
                }
            )
            console.log(product);
        }
    );
}

exports.getAllProducts=(req,res)=>{
    let limit=req.query.limit ? parseInt(req.query.limit) :8;
    let sortBy=req.query.sortBy ? req.query.sortBy :"asc";
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy,"asc"]])
        .limit(limit)
        . exec(
            (err,products)=>{
                if(err){
                    return res.status(400).json({
                        error: "No Product Found"
                    });
                }
                res.json(products);
            }
        );
}

exports.getDistinctCategories=(req,res)=>{
    Product.distinct("category",
        {},
        (err,categories)=>{
            if(err){
                return res.status(400).json({
                    error : "get categories failed"
                });
            }
            res.json(categories);

        }
    );
}

exports.updateInventory=(req,res,next)=>{
    let operation=req.body.order.products.map(product=>{
        return {
            updateOne:{
                filter :{_id:product._id},
                update :{$inc: {stock: -product.count,sold:+product.count}}  
            },
        }
    });

    Product.bulkWrite(
        operations,
        {},
        (err,products)=>{
            if(err){
                return res.status(400).json({
                    error : "bulk operation failed"
                });
            }
            next();
        }
    
    )

}