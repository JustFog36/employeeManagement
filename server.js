const inquirer = require('inquirer');
const connection = require('./db/connection.js');

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
})