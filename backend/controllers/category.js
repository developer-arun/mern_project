const Category=require('../models/category');


exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec(
        (err,category)=>{
            if(err||!category){
                return res.status(400).json({
                    error : "Required Category no Found"
                });
            }
        req.category=category;
        next();
    });
}

exports.createCategory=(req,res)=>{
    const category=new Category(req.body);
    category.save(
        (err,category)=>{
            if(err||!category){
                return res.status(400).json({
                    error : "Error while saving in Db"
                })
            }
            res.json(category);
    });
}

exports.getCategory=(req,res)=>{
    console.log(req.category);
    res.json(req.category);
}

exports.getAllCategory=(req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err||!categories){
            return res.status(400).json({
                error : "Error while loading in Db"
            });
        }
        console.log(categories);
        res.json(categories);
    });
}
exports.updateCategory=(req,res)=>{
    const category=req.category;
    category.name=req.body.name;
    category.save((err,newcate)=>{
        if(err||!newcate){
            return res.status(400).json({
                error : "Error while updating in Db"
            });
        }
        res.json(newcate);
    })
}

exports.removeCategory=(req,res)=>{
    const category=req.category;

    category.remove((err,category)=>{
        if(err){ 
            return res.status(400).json({
                error : "Error while deleeting in Db"
            });
        }
        res.json({
            message : `${category.name} is deleted`
        })
    });
}