const inquirer = require('inquirer');
const connection = require('./db/connection.js');

connection.connect(
    (error) => {
        if (error) {
            console.log(error)
        } else {
            menu();
        }
    }
)

    const menu = () => {
        inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Please select an option.',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        
        }
    ])
    .then((answers) => {
        console.log(answers)
        if(answers.choice === 'View All Employees') {
            viewAllEmployees()
        }
        else if(answers.choice === 'Add Employee') {
            addEmployee()
        }
        else if(answers.choice === 'Update Employee Role') {
            updateEmployeeRole()
        }
        else if(answers.choice === 'View All Roles') {
            viewAllRoles()
        }
        else if(answers.choice === 'Add Role') {
            addRole()
        }
        else if(answers.choice === 'View All Departments') {
            viewAllDepartments()
        }
        else if(answers.choice === 'Add Department') {
            addDepartment()
        }
        else {
            process.exit()
        }
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    })
    }

    const viewAllEmployees = () => {
        connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.first_name AS managerFirstName, manager.last_name AS managerLastName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON  role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id`,
            function(err, results) {
                console.log(err);
                console.table(results);
                menu()
            }
        );
    }
    
    
    const addEmployee = () => {

        connection.query('SELECT * FROM role', function(err, res) {
            if (err) {
                console.error(err);
                return;
            }
    
            const roles = res.map(({ title }) => title);
        
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role_id",
                message: "What is the employee's role?",
                choices: [...roles,]
            },
            {
                type: "list",
                name: "manager_id",
                message: "Who is the employee's manager",
                choices: ['None', 'Just', 'Sky']
            }
        ])
        .then((answers) => {
            console.log(answers);
    
            const roleIdMapping = {
                'Sales Lead': 1,
                'Salesperson': 2,
                'Lead Engineer': 3,
                'Software Engineer': 4,
                'Account Manager': 5,
                'Accountant': 6,
                'Legal Team Lead': 7,
                'Lawyer': 8
            };
    
            const roleId = roleIdMapping[answers.role_id];

            const managerIdMapping = {
                'None': null, 
                'Just': 1,
                'Sky': 2,
            };
    
            const managerId = managerIdMapping[answers.manager_id];    
    
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: roleId,
                    manager_id: managerId
                },
                function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('New employee has been added!');
                    }
                    menu();
                });
            });
        });
    };
    
    
    const updateEmployeeRole = () => {
    
        connection.query('select * from employee', function (err, res) {
            const employeeList = res.map(({id, first_name, last_name}) => ({
                name: first_name + ' ' + last_name,
                value: id, 
            }))
    
         connection.query('select * from role', function (err, res) {
                const roleList = res.map(({ id, title }) => ({
                    name: title ,
                    value: id
                }))
      
         inquirer.prompt([
            {
                type: "list",
                name: "updateER",
                message: "Which employee's role do you want to update?",
                choices: employeeList
            },
            {
                type: "list",
                name: "updateRoleTitle",
                message: "Which role do you want to assign the selected employee?",
                choices: roleList
            }
        ])
        .then((answers) => {
            console.log(answers)
            connection.query(
                `UPDATE employee SET role_id = '${answers.updateRoleTitle}' WHERE id = ${answers.updateER}`,
                function (err, results) {
                    console.log(err);
                    console.log('New role has been assigned to the employee!');
                    menu();
                }
            );
        })
       })
     })
    }
    
    
    const viewAllRoles = () => {
        connection.query(
                `SELECT * FROM role`,
                function(err, results) {
                    console.log(err);
                    console.table(results);
                    menu()
                }
        );
    }
    
    
    const addRole = () => {
        connection.query('SELECT * FROM department', function(err, res) {
            const departmentList = res.map(({ id, name }) => ({
                name: name,
                value: id
            }))
    
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'Enter the name of the role:'
                },
                {
                    type: 'input',
                    name: 'newSalary',
                    message: 'What is the salary?'
                },
                {
                    type: 'list',
                    name: 'newDepartmentId',
                    message: 'Choose the department:',
                    choices: departmentList
                }
            ])
            .then((answers) => {
                console.log(answers)
                connection.query(
                    `INSERT INTO role(title, salary, department_id) VALUES('${answers.newRole}', '${answers.newSalary}', '${answers.newDepartmentId}')`,
                    function(err, results) {
                        console.log(err);
                        console.log('New Role has been added!');
                        menu();
                    }
                );
            })
    
        })
    }
    
    
    const viewAllDepartments = () => {
        connection.query(
            `SELECT * FROM department`,
            function(err, results) {
                console.log(err);
                console.table(results);
                menu()
            }
        );
    }
    
    
    const addDepartment = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department.'
            }
        ])
        .then((answers) => {
            console.log(answers)
            connection.query(
                `INSERT INTO department(name) VALUES('${answers.departmentName}')`,
                function(err, results) {
                    console.log(err);
                    console.table(results);
                    menu()
                }
            )
        });
    }