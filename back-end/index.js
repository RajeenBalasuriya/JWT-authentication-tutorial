const express = require('express');
const app=express();
const db = require('./models');
const {User}=require('./models');

const bcrypt = require('bcrypt');

app.use(express.json());

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
 
    res.json("login");
});



app.get('/profile', async (req, res) => {
 
    res.json("profile");
});

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server is running on port 3000');
    });
});
