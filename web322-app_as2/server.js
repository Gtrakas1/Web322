/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: George Trakas Student ID: 108459173 Date: June 1st,2018
*
* Online (Heroku) Link:    https://hidden-woodland-79676.herokuapp.com/
*
********************************************************************************/
var datas= require("./data-service.js");
var path= require("path");
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
//statice middleware used to return css files
app.use(express.static('public'));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
   res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
   res.sendFile(path.join(__dirname,"/views/about.html"));
});
app.get("/employees",function(req,res){
 datas.getAllEmployees().then((data)=>{
  res.json(data);
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


