router.post("/register",async (req,res) => {
    const newUser=new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    //await user.save();
    //res.send("ok")
    try{
        const user=await newUser.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
})
module.exports=router;