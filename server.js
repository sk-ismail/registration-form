const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "./static")));
app.use(express.json());



mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

const db = mongoose.connection;

app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  const { Username, Password} = req.body;
  const hash= await bcrypt.hash(Password, 10);
  try {
   await model.create({
      Username, Password: hash
    })
    
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: 'Username exists'})
    
  }

  res.json({ status: "ok" });
});

app.post('/api/login', async (req, res) => {
  //console.log(req.body);
  const { Username, Password }=req.body;
  const user=await model.findOne({ Username}).lean()
  if(user){
    if(await bcrypt.compare(Password, user.Password)){

     const token=jwt.sign({id: user._id, Username: user.Username}, process.env.SECRET_TOKEN)
      res.json({status: 'ok', data: token})

    }
    else{
      res.json({status: 'error', error: 'Invaild Username/Password'})
    }
    
    
  }
  else{
    res.json({status: 'error', error: 'Invaild Username/Password'})
  }

  
  
} )

app.post('/api/forgotPassword', async (req, res) => {
  //console.log(req.body);
  const { token, newPassword }=req.body;

  try{
  const user=jwt.verify(token, process.env.SECRET_TOKEN);
  
  const _id=user.id;
  
  const Password= await bcrypt.hash(newPassword, 10)
  
  const final=await model.updateOne({ _id }, {
    
    $set: {Password: Password}
  })
  
  res.json({status: 'ok'})
  }catch(error){
    res.json({status: 'error', error: "error"})
  }
  
  //const newPassword=model.
 
  
  //const user=model.apply()
  
} )

app.listen(5050, () => {
  console.log("server listening..");
});

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  //model.create({ Username: "username", Password: "password" });
  console.log("connected!");
});


const Schema = new mongoose.Schema(
  {
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
  },
  { collection: "usersdata" }
);

const model = mongoose.model("Schema", Schema);
