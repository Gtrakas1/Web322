/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: George Trakas Student ID: 108459173 Date: 7/18/2018
*
* Online (Heroku) Link:  https://agile-ocean-47641.herokuapp.com/
*
********************************************************************************/ 
var datas= require("./data-service.js");
var path= require("path");
var express = require("express");
var multer=require("multer");
var app = express();
var fs=require("fs");
var exphbs=require("express-handlebars");
const bodyParser=require('body-parser');

var HTTP_PORT = process.env.PORT || 8080;
//statice middleware used to return css files
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended : true}));

// setup a 'route' to listen on the default url path (http://localhost)
app.use(function(req,res,next){     
  let route = req.baseUrl + req.path;     
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");     
  next(); }); 


  app.get("/", function(req,res){
   res.render("home");
});

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

app.post("/employee/update", (req, res)=>{
  console.log(req.body);
datas.updateEmployee(req.body).then((data)=>{
  console.log(req.body);
  res.redirect("/employees");
}).catch((err)=>{
  console.log(err);
})
 });



app.get("/employees/add", function(req,res){
  res.render("addEmployee");

});

app.get("/images/add", function(req,res){
  res.render("addImage");

});

app.get("/about", function(req,res){
  res.render("about");
});

app.get("/images", function(req, res){
  fs.readdir(__dirname + "/public/images/uploaded", function(err, data){
res.render("images",{images : data});
  });
});


// setup another route to listen on /about


app.get("/employees",function(req,res){
if(req.query.status){
  datas.getEmployeesByStatus(req.query.status)
  .then(function(data){
      res.render("employees",{employees:data});  
    })
  .catch(function(err){
      res.render("employees",{message: "no results"});
  })
}
else if(req.query.department){
  datas.getEmployeesByDepartment(req.query.department)
  .then(function(data){
    res.render("employees",{employees:data}); })
  .catch(function(err){
    res.render("employees",{message: "no results"});  })
}
else if(req.query.manager){
  datas.getEmployeesByManager(req.query.manager)
  .then(function(data){
    res.render("employees",{employees:data});  })
  .catch(function(err){
    res.render("employees",{message: "no results"+err});  })
}
else{
  datas.getAllEmployees()
  .then(function(data){
    res.render("employees",{employees:data});  })
  .catch(function(err){
    res.render("employees",{message: "no results"}); })
}    
});

app.get("/employee/:num", function(req, res){
  datas.getEmployeeByNum(req.params.num)
.then(function(data){
  res.render("employee",{employee: data});
})
.catch(function(err){
  res.render("employee",{message:"no results"});
})
});

app.get("/departments",function(req,res){
  datas.getDepartments().then((data)=>{
    res.render("departments",{department:data});
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

app.engine('.hbs', exphbs({ extname: '.hbs',
defaultLayout: "main",
helpers:{
  
    navLink: function(url, options){     
      return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') 
      + '><a href="' + url + '">' 
      + options.fn(this) + '</a></li>'; 
    },
 equal: function (lvalue, rvalue, options) { 
  if (arguments.length < 3)         
  throw new Error("Handlebars Helper equal needs 2 parameters");     
  if (lvalue != rvalue) 
  { 
    return options.inverse(this);     
    }

else{ 
  return options.fn(this); 
  } 
} 
 
 
}
 })
);

app.set('view engine', '.hbs');

