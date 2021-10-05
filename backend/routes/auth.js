var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup,signin,isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("firstname","firstname should be atleast 2 charater long")
    .isLength({min :2}),

    check("email","Email is incorrect").isEmail(),

    check('password','Password should be atelast 4 char long').isLength({min:4})
  
  ]  
  ,signup
);

router.post(
  "/signin",
  [
    check("email","Email is incorrect").isEmail(),

    check('password','Password should be atelast 4 char long').isLength({min:4})

  ],
  signin
)

router.get("/signout", signout);

router.get('/test',isSignedIn,(req,res)=>{
  res.json(req.auth);
});

module.exports = router;
