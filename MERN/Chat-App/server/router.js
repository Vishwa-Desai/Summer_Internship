const express=require('express');
const router=express.Router();


//creating routes
router.get('/',(req,res)=>{
    res.send('server is up and running');
});

module.exports=router;