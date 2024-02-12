const express = require('express');
const app=express();
const db = require('./models');
const {User}=require('./models');
const cookieParser = require('cookie-parser');
const {createTokens,validateToken}=require('./JWT');


const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cookieParser());

app.post('/register', async (req, res) => {
    const {username,password} = req.body;
    bcrypt.hash(password,10).then((hash)=>{
        User.create({
            username:username,
            password:hash
        }).then(()=>{
            res.json("user created successfully!");
        }).catch(err=>{
            if(err){
                res.status(400).json(err);
            }
        });
    })
 
  
});


app.post('/login', async (req, res) => {
 
    const{username,password}=req.body;

    const user=await User.findOne({where:{username:username}});

    if(!user) res.status(400).json("user not found");

    const dbPassword=user.password;

    bcrypt.compare(password,dbPassword).then((match)=>{
        if(!match) res.status(400).json("wrong username or password");
        else {
            
            const accessToken=createTokens(user);
            res.cookie("access-token",accessToken,{maxAge:60*60*24*30*1000,httpOnly:true});
            res.json    ({message:"logged in successfully",accessToken});
        
        };
    });

    
});



app.get('/profile',validateToken, async (req, res) => {
 
    res.json("profile");
});

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server is running on port 3000');
    });
});
