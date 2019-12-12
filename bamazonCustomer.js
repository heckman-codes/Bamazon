var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log(("Welcome to Bamazon! What would you like to buy?"))
    showAll();
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

const initializeApp = function () {
    inquirer.prompt([
        {
            name: "id",
            message: "What item would you like to purchase?"
        },
        {
            name: "quantity",
            message: "How many would you like to purchase?"
        }
    ]).then(function (answers) {
        connection.query('SELECT * FROM products WHERE item_id=' + answers.id, function (err, result) {
            if (err) {
                throw err
            }
            // console.log(answers.id)
            // console.log(result);

            if (result[0].stock_quantity < answers.quantity) {
                console.log("Insufficient Quantity!")
                initializeApp();
            } else {
                console.log("Your total will be: $" + parseInt(result[0].price * answers.quantity));

                connection.query('UPDATE products SET stock_quantity=' + (result[0].stock_quantity - answers.quantity) + ' WHERE item_id=' + answers.id,
                    function (err) {
                        if (err) {
                            throw err;
                        }
                    })
            }
        })



    })
}

