

const Sequelize = require('sequelize');

var sequelize = new Sequelize('dd7u8t0lil2pcp', 'abpcknddgwyaht', '5cf17d3b3fcce0b052e443b44141a432d97a4de265624ad61dada5c8abff9378', {
    host: 'ec2-107-22-183-40.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: '5432',
    operatorsAliases: true,
    dialectOptions: {
        ssl: true
    }
});



var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    martialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
}, {
        createdAt: false,
        updatedAt: false

    });

var Department = sequelize.define('Department', {
    departmentid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
}, {
        createdAt: false,
        updatedAt: false


    })



module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then((Employee) => {
            resolve("Connected to database")
        })
            .then((Department) => {
                resolve("Connected to database")

            })
            .catch(() => {
                reject("You did not connect");
            });
    });

}



module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {

        Employee.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no employee found" + err);
            })
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { status: status }
        })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no status found" + err);
            })
    })


}



module.exports.getEmployeeByManagers = (manager) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { employeeManagerNum: manager }})
            .then((data) => {
                resolve(data);
            }).catch((err) => {
                reject("You don't know how to manage");
            })
    })
}

module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        Department.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no department found" + err);
            })
    });
}


module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
            Employee.findAll({
                where: { department: department }
            })
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject("no department found" + err);
                })
        
    })

}

module.exports.addDepartment = (departData) => {
    return new Promise((resolve, reject) => {

        for (let i in departData) {
            if (departData[i] == "") {
                departData[i] = null;
            }
        }

        Department.create({
            departmentid: departData.departmentid,
            departmentName: departData.departmentName
        })
            .then(() => {
                console.log("Department created");
                resolve();
            })
            .catch((err) => {
                reject("Can't find Emp data");
            })
    });

}

module.exports.updateDepartment = (departData) => {

    return new Promise((resolve, reject) => {

        for (let i in departData) {
            if (departData[i] == "") {

                departData[i] == null;
            }
        }
        Department.update({
            departmentid: departData.departmentid,
            departmentName: departData.departmentName
        }, {
                where: {
                    departmentid: departData.departmentid
                }
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("department not updated" + err);
            })



    })
}

module.exports.getDepartmentByid = (id) => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {
                departmentid: id
            }
        })
            .then((data) => {
                resolve(data[0]);
            })
            .catch((err) => {
                reject("coud not find id" + err);
            })

    })


}


module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        };
        Employee.create({employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
})
            .then(() => {
                console.log("You created an employee")
                resolve();
            })
            .catch((err) => {
                reject("Check your create" + err);
            })
    })

};

module.exports.getEmployeeByNum = (num) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: { employeeNum: num }
        })
            .then((data) => {
                resolve(data[0]);
            })
            .catch((err) => {
                reject("no employee found" + err);
            })
    });
}

module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        }

        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate

        }, {
                where:
                    { employeeNum: employeeData.employeeNum }
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Check your update" + err);
            })
    })

}

module.exports.deleteEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: { employeeNum: num }
        }).then(() => {
            resolve("Employee destroyed")
        })
            .catch(() => {
                reject("You are weak and could not destroy employee")
            })
    })
}

