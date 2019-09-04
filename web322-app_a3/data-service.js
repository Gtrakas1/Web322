
const fs=require('fs');
var exports = module.exports = {};
var employees = [] ;
var departments = [];
var empCount=0;
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
        var stat= [];
        return  new Promise ((resolve,reject)=>{
        for(var i=0;i<employees.length;i++)
        {
            stat.push(employees[i]);
        }
        if(stat.length == 0)
        {
            reject("no results returned");
        }
        resolve(stat);
    });
    }
exports.getEmployeesByStatus= (status)=>{
    var employee = [];
    return new Promise((resolve,reject)=>{

        for(let i=0;i<employees.length;i++)
        {if(employees[i].status == status)
           { employee.push(employees[i]);}
        }
        if(employee.length == 0){
            reject("No employee found");
        }
        resolve(employee);
    })
    

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
    exports.getEmployeeByManagers= (manager)=>{
    var manage=[];
        return new Promise((resolve,reject)=>{
for(let i=0;i<employees.length;i++)
{
    if(employees[i].employeeManagerNum == manager)
    {
        manage.push(employees[i])
    }
    if(manage.length==0)
    {
        reject("You can't manage");
    }
    resolve(manage);
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
})
exports.getEmployeesByDepartment=(department)=>{
    let depart= [];
    for(let i=0;i<departments.length;i++)
    {
        if(employees[i].department==department)
        {
            depart.push(employees[i]);
        }
        
    }
    if(depart.length == 0)
    {
        reject("Could not find a department");
    }
    resolve(depart);
}
    };
exports.addEmployee = (employeeData) => {
    return new Promise((resolve,reject)=>{
   if(employeeData.isManager=== undefined)   
    {
    employeeData.isManager=false;
     employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    resolve(employees);
 
   }
    else{
        employeeData.isManager = true;
        employeeData.employeeNum=employees.length + 1;
        employees.push(employeeData);
        resolve(employees);
    }
    
           

 })

    };
    exports.getEmployeeByNum= (num)=>{
        return new Promise((resolve,reject)=>{
            for(let i=0;i<employees.length; i++)
            {
                if(employees[i].employeeNum == num){
                    resolve(employees[i]);
                }
            }
            reject("No numbers are found");
        })
    }
    
