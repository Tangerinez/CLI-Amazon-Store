const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "yourRootPassword",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  // initialize();
  viewProducts();
});

function initialize() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Menu Options",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(response) {
      switch (response.action) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        case "Exit":
          console.log("Goodbye Manager!");
          connection.end();
          break;
      }
    });
}

function viewProducts() {
  let query = connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, res) {
      console.log(res);

      inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "What would you like to do next?",
          choices: [
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
          ]
        })
        .then(function(response) {
          switch (response.action) {
            case "View Low Inventory":
              viewLowInventory();
              break;
            case "Add to Inventory":
              addToInventory();
              break;
            case "Add New Product":
              addNewProduct();
              break;
            case "Exit":
              console.log("Goodbye Manager!");
              connection.end();
              break;
          }
        });
    }
  );
}
