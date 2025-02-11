const express=require('express');
const {handlerUserSignup,handlerUserLogin}=require("../controllers/user");
const router=express.Router();

router.post("/",handlerUserSignup);
router.post("/login",handlerUserLogin);

module.exports=router;