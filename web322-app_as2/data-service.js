
const fs=require('fs');
var exports = module.exports = {};
var employees = [] ;
var departments = [];

 exports.initialize=function(){
    fs.readFile('data/employees.json', 'utf-8',(err,data)=>{
try{
    employees=JSON.parse(data);
}
        catch(err){
            console.err("oops.Try again",err.message);
       }
       });
    fs.readFile('./data/department.json',(err,data)=>{
        if(err)
        {
            throw ("Oh No"+err);
        }
        departments=JSON.parse(data);
    });
    return new Promise((resolve,reject)=>{
        resolve("Success");
        if(err){
        reject("cant read data");
        }
    });
}
    exports.getAllEmployees=function(){
    return  new Promise ((resolve,reject)=>{
            resolve(employees);
            if(employees.length == 0)
            {
                reject("no results returned");
            }
        });
    }
    exports.getManagers=function(){
        return new Promise ((resolve,reject)=>{
            let managers= employees.filter(employees=>employees.isManager == true);
            resolve(managers);
            if(employees.length==0)
            {
                reject("Can't read data");
            }
        })
    }
    exports.getDepartments=function(){
        return new Promise ((resolve,reject)=>{
    resolve(departments);
if(departments.length==0)
{
    reject("Something is wrong");
}
});
}
    
