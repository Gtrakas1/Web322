/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: George Trakas Student ID: 108459173 Date: June 22nd,2018
*
* Online (Heroku) Link:   https://hidden-woodland-79676.herokuapp.com/
*
********************************************************************************/
var datas= require("./data-service.js");
var path= require("path");
var express = require("express");
var multer=require("multer");
var app = express();
var fs=require("fs");
const bodyParser=require('body-parser');
var HTTP_PORT = process.env.PORT || 8080;


// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
const storage =multer.diskStorage({
  destination:"./public/images/uploaded",
  filename : function(req,file,cb){
    cb(null,Date.now() + path.extname(file.originalname));
  }
});
const upload= multer({storage:storage});
app.post("/images/add",upload.single("imageFile"),(req,res)=>{
res.redirect("/images");
})
app.post("/employees/add", function(req, res){
  datas.addEmployee(req.body)
  .then(function(data){
      res.redirect("/employees")
  })
  .catch(function(err){
    res.redirect("/employees")
  })
});
  

app.get("/images", function(req, res){
  fs.readdir(__dirname + "/public/images/uploaded", function(err, images){
       res.json({images});
  });
});
//statice middleware used to return css files
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended : true}));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
   res.sendFile(path.join(__dirname +"/views/home.html"));
});
app.get("/employees/add", function(req,res){
  res.sendFile(path.join(__dirname +"/views/addEmployee.html"));
});
app.get("/images/add", function(req,res){
  res.sendFile(path.join(__dirname +"/views/addImage.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
   res.sendFile(path.join(__dirname +"/views/about.html"));
});
app.get("/employees",function(req,res){
if(req.query.status){
  datas.getEmployeesByStatus(req.query.status)
  .then(function(data){
      res.json(data);
  })
  .catch(function(err){
      res.send(err);
  })
}
else if(req.query.department){
  datas.getEmployeesByDepartment(req.query.department)
  .then(function(data){
      res.json(data);
  })
  .catch(function(err){
      res.send(err);
  })
}
else if(req.query.manager){
  datas.getEmployeesByManager(req.query.manager)
  .then(function(data){
      res.json(data);
  })
  .catch(function(err){
      res.send(err);
  })
}
else{
  datas.getAllEmployees()
  .then(function(data){
      res.json(data);
  })
  .catch(function(err){
      res.send(err);
  })
}    
});

app.get("/employee/:num", function(req, res){
datas.getEmployeeByNum(req.params.num)
.then(function(data){
  res.json(data);
})
.catch(function(err){
  res.send(err);
})
});

app.get("/departments",function(req,res){
  datas.getDepartments().then((data)=>{
    res.json(data);
  })
  });

app.get("/managers",function(req,res){
  datas.getManagers().then((data)=>{
  res.json(data);
  })
});
app.use((req,res)=>{
  res.status(404).send("Wat Happended");
});
datas.initialize()
.then ((data) =>{
  app.listen(HTTP_PORT, onHttpStart);
})
.catch(()=>{
  console.log("There was and error initializing");
})



