/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: George Trakas Student ID: 108459173 Date: August 11th,2018
*
* Online (Heroku) Link: https://floating-crag-67444.herokuapp.com/ 
*
********************************************************************************/ 
var datas = require("./data-service.js");
var path = require("path");
var express = require("express");
var multer = require("multer");
var app = express();
var fs = require("fs");
var exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
var dataAuth=require("./data-service-auth.js");
const cLs=require('client-sessions');

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.use(cLs({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "web322_a6", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
 });

app.use(bodyParser.urlencoded({ extended: true }));

//statice middleware used to return css files
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: "main",
  helpers: {

    navLink: function (url, options) {
      return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '')
        + '><a href="' + url + '">'
        + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      }

      else {
        return options.fn(this);
      }
    }


  }
})
);

app.set('view engine', '.hbs');




// setup a 'route' to listen on the default url path (http://localhost)
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});



// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



app.get("/", function (req, res) {
  res.render("home");
});



app.get("/images/add",ensureLogin, function (req, res) {
  res.render("addImage");

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/images",ensureLogin, function (req, res) {
  fs.readdir(__dirname + "/public/images/uploaded", function (err, data) {
    res.render("images", { images: data });
  });
});


// setup another route to listen on /about
app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register")
})

app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory",ensureLogin,function(req,res){
res.render('userHistory');
})

app.get("/employees",ensureLogin, function (req, res) {
  if (req.query.status) {
    datas.getEmployeesByStatus(req.query.status)
      .then(function (data) {
        if(data.length > 0){
          res.render("employees", { employees: data,
          title: 'Employee' });
        }
        else{
          res.render("employees",{message: "no results"});
        }
        
      })
      .catch(function (err) {
        res.render("employees", { message: "no results" + err});
      })
  }
  else if (req.query.department) {
    datas.getEmployeesByDepartment(req.query.department)
      .then(function (data) {
        if(data.length > 0){
          res.render("employees", { employees: data,
          title: 'Employee' });
        }
        else{
          res.render("employees",{message: "no results"});
        }
        
      })
      .catch(function (err) {
        res.render("employees", { message: "no results "+ err });
      })
  }
  else if (req.query.manager) {
    datas.getEmployeeByManagers(req.query.manager)
      .then(function (data) {
        if(data.length > 0){
          res.render("employees", { employees: data,
          title: 'Employee' });
        }
        else{
          res.render("employees",{message: "no results"});
        }
         
      })
      .catch(function (err) {
        res.render("employees", { message: "no results "+ err });
      })
  }
  else {
    datas.getAllEmployees()
      .then(function (data) {
        if(data.length > 0){
          res.render("employees", { employees: data,
          title: 'Employee' });
        }
        else{
          res.render("employees",{message: "no results"});
        }
          })
      .catch(function (err) {
        res.render("employees", { message: "no results" + err});
      })
  }


});

app.get("/employee/:num",ensureLogin, (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  datas.getEmployeeByNum(req.params.num).then((data) => {
    if (data) {
      viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
      viewData.employee = null; // set employee to null if none were returned
    }
  }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
  }).then(datas.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"
      // loop through viewData.departments and once we have found the departmentid that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentid == viewData.employee.department) {
          viewData.departments[i].selected = true;
        }
      }
    }).catch((err) => {
      console.log(err);
      viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
      if (viewData.employee == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
      }
    })
    .catch((err)=>{
      res.status(500).send("Unable to Update Employee");
     })

});

app.get("/departments",ensureLogin, function (req, res) {

  datas.getDepartments()
.then((data) => {
    if(data.length > 0){
      console.log(data);
        res.render("departments", { data : data,
        title:'Department' });
    }
    else{
      res.render("departments", { message: "no results" });
 
    }
      })
  .catch((err) => {
    console.log(err)
    res.render("departments", { message: "no results"+ err });
  })
});

app.get("/department/:id",ensureLogin, function (req, res) {
  datas.getDepartmentByid(req.params.id)
    .then(function (data) {
      res.render("department", { department: data });
    })
    .catch(function (err) {
      res.status(404).send("Department Not Found");
    })
});





app.get("/departments/add",ensureLogin, ((req, res) => {
  res.render("addDepartment");
}))

app.get("/employees/add",ensureLogin, function (req, res) {
  datas.getDepartments().then((data) => {
    res.render("addEmployee", { departments: data });
  })
    .catch((err => {
      res.render("addEmployee", { departments: [] });
    }))
});

app.get("/employees/delete/:num",ensureLogin,(req,res)=>{
  datas.deleteEmployeeByNum(req.params.num)
  .then(()=>{
    res.redirect("/employees")
  })
  .catch((err)=>{
    res.status(500).send("Cannot Remove and find employee")
  })
})

app.post("/register",((req,res)=>{
  dataAuth.registerUser(req.body)
  .then((value)=>{
    res.render("register", {successMessage: "User Created"})
  })
  .catch((err)=>{
    res.render("register",{errorMessage: err, userName: req.body.userName} )
  })
}))

app.post('/login', (req, res) => {
  // must set the value of client's "User-Agent" to the request body
  req.body.userAgent = req.get('User-Agent');

  dataAuth.checkUser(req.body)
  .then((user) => {
      req.session.user = {
          userName: user.userName,
          email: user.email,
          loginHistory: user.loginHistory
      }

      res.redirect('/employees');

  }).catch((err) => {
      res.render('login', {errorMessage: err, userName: req.body.userName});
  });
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
})

app.post("/employees/add", function (req, res, data) {
  datas.addEmployee(req.body)
    .then(function (data) {
      res.redirect("/employees")
    })
    .catch((err)=>{
      res.status(500).send("Unable to Update Employee");
     })
});

app.post("/employee/update",ensureLogin, (req, res) => {
  console.log(req.body);
  datas.updateEmployee(req.body).then(() => {
    console.log(req.body);
    res.redirect("/employees");
  }).catch((err)=>{
    res.status(500).send("Unable to Update Employee");
   })
});

app.post("/departments/add",ensureLogin, (req,res) => {
  datas.addDepartment(req.body)
  .then((data) => {
    res.redirect("/departments")
  })
  .catch((err)=>{
    res.status(500).send("Unable to Update Employee");
   })

   
});

app.post("/department/update",ensureLogin, (req, res) => {
  datas.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  })
  .catch( ()=>{
    res.status(500).send("Unnable to update department");
})
});


app.use((req, res) => {
  res.status(404).send("Wat Happended");
});


dataAuth.initialize()
.then(dataAuth.initialize)  
.then((data) => {
    app.listen(HTTP_PORT, onHttpStart);

  })
  .catch(() => {
    console.log("There was and error initializing");
  })
