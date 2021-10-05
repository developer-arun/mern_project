require('dotenv').config();
const User = require("../models/user");
const {check ,validationResult}=require("express-validator");
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt');



exports.signup = (req, res) => {
  const error=validationResult(req);
  if(!error.isEmpty()){
    console.log('\n'+error+'\n');
    return res.status(422).json({
      error: error.array(),
    }) 
  }

  const user = new User(req.body);
  console.log(user);
  user.save((err, user) => {
    if (err) {
      console.log('\n'+err+"\n");
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name   :user.firstname,
      email  :user.email,
      id     :user._id
    });
  });
};


exports.signin= (req,res) =>{
  const error=validationResult(req);
  if(!error.isEmpty()){
    console.log("\n"+error+"\n");
    return res.status(422).json(error);
  }
  
  const {email,password}=req.body;
  console.log(email+password);
  User.findOne({ "email": email},(err,user)=>{
    
    if(err||user===null){
      console.log(err);
      return res.status(422).json({
        err :"NO email found"
      });
    }

    if(!user.authenticate(password)){
        return res.status(401).json({
          err :"Incorrect password"
        });
    }
    
    //token creatation
    const token=jwt.sign({_id:user._id},process.env.SECRET);    
    
    //putting cookie
    res.cookie("login-token",token,{expire :new Date()+100});
    
    const {firstname,email,lastname,roll,_id}=user;
    return res.json({
      token,
      user: {firstname,email,lastname,roll,_id}
    })
  });

}



exports.signout = (req, res) => {
  res.clearCookie("login-token");
  res.json({
    msg :"signout successful"
  })
};

//protect routes
exports.isSignedIn=expressJwt({
  secret :process.env.SECRET,
  userProperty: "auth"
});

//custom middleware
exports.isAuthenticated=(req,res,next)=>{
  console.log(req.profile);
  console.log(req.auth);
  let checker=req.profile && req.auth && req.profile._id==req.auth._id;
  if(!checker){
    return res.status(403).json({
      error :"ACCESS DENIED"
    })
  }
  next();
};

exports.isAdmin=(req,res,next)=>{
  if(req.profile.role===0){
    return res.status(403).json({
      error : "NO ADMIN ACCESS"
    })
  }
  next();
};