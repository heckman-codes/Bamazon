var mysql = require("mysql");
var inquirer = require("inquirer");
var managerOptions = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

const showAll = function () {
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) {
            throw err
        }

        console.table(result);
        initializeApp();
    })
}

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Welcome to Bamazon Manager!");
    initializeApp();
});

const initializeApp = function () {
    inquirer.prompt([
        {
            name: "choices",
            message: "What would you like to do?",
            type: "list",
            choices: managerOptions
        }
    ]).then(function (answers) {
        // console.log(answers);
        if (answers.choices == managerOptions[0]) {
            showAll();
        } else if (answers.choices == managerOptions[1]) {
            connection.query('SELECT * FROM products WHERE stock_quantity < 10', function (err, result) {
                if (err) {
                    throw err;
                }

                console.table(result);
                initializeApp();
            })
        } else if (answers.choices == managerOptions[2]) {
            inquirer.prompt([
                {
                    name: "id",
                    message: "What item ID would you like to add inventory?"
                },
                {
                    name: "quantity",
                    message: "How many are you adding?"
                }
            ]).then(function (answers) {
                connection.query('SELECT * FROM products WHERE item_id=' + answers.id, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    // console.log(result[0].stock_quantity)
                    connection.query('UPDATE products SET stock_quantity=' + (parseInt(result[0].stock_quantity) + parseInt(answers.quantity)) + ' WHERE item_id=' + answers.id,
                        // [
                        //     { stock_quantity: parseInt(result[0].stock_quantity + answers.quantity) },
                        //     { item_id: answers.id }

                        // ], 
                        function (err) {
                            if (err) {
                                throw err;
                            }
                        })
                    initializeApp();
                });

            });
        } else if (answers.choices[3]) {
            inquirer.prompt([
                {
                    name: "name",
                    message: "What is the item would you like to add?"
                },
                {
                    name: "department",
                    message: "What department does this belong to?"
                },
                {
                    name: "price",
                    message: "What is the price?"
                },
                {
                    name: "quantity",
                    message: "How many are you adding?"
                }

            ]).then(function (answers) {

                connection.query('INSERT INTO products SET ?',
                    {
                        product_name: answers.name,
                        department_name: answers.department,
                        price: answers.price,
                        stock_quantity: answers.quantity
                    }),
                    function (err) {
                        if (err) {
                            throw err;
                        }
                    }
                initializeApp();
            })

        }
    })
}