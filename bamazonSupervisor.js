var mysql = require("mysql");
var inquirer = require("inquirer");
var supervisorOptions = ["View Product Sales by Deparment"]

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Welcome to Bamazon Supervisor!")
    initializeApp();
})

const initializeApp = function () {
    inquirer.prompt([
        {
            name: "choices",
            message: "What would you like to do?",
            type: "list",
            choices: supervisorOptions
        }
    ]).then(function (answers) {
        if (answers.choices == supervisorOptions[0]) {
            connection.query('SELECT * FROM departments', function (err, result) {
                if (err) {
                    throw err;
                }

                console.table(result);
            })
        }
    })
}