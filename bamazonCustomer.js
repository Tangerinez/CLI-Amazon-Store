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
  initialize();
});

function initialize() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Would you like to enter the marketplace?",
      choices: ["Yes", "No"]
    })
    .then(function(response) {
      console.log("--------------------------------------------------");
      if (response.action === "Yes") {
        displayDatabaseItems();
      } else if (response.action === "No") {
        console.log("See you next time!");
        connection.end();
      }
    });
}

function displayDatabaseItems() {
  let query = connection.query(
    "SELECT item_id, product_name, price FROM products",
    function(err, res) {
      console.log(res);
      inquirer
        .prompt([
          {
            name: "item_ID",
            type: "input",
            message:
              "Please type in the ID of the product you would like to buy: ",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("Please enter a valid existing ID");
              return false;
            }
          },
          {
            name: "quantity",
            type: "input",
            message:
              "Please enter the number of this product that you would like to buy: ",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("Please enter a whole number");
              return false;
            }
          }
        ])
        .then(function(response) {
          console.log("--------------------------------------------------");
          checkStoreForQuantity(response.item_ID, response.quantity);
        });
    }
  );
}

function checkStoreForQuantity(response_item_ID, response_quantity) {
  let query = connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, res) {
      if (response_quantity <= res[response_item_ID - 1].stock_quantity) {
        inquirer
          .prompt({
            name: "action",
            type: "list",
            message:
              "Looks like we have this item in stock for the quantity you requested. Would you like to confirm your transaction?",
            choices: ["Yes", "No"]
          })
          .then(function(response) {
            console.log("--------------------------------------------------");
            if (response.action === "Yes") {
              updateDatabase(
                res[response_item_ID - 1].item_id,
                res[response_item_ID - 1].stock_quantity,
                response_quantity,
                res[response_item_ID - 1].product_name,
                res[response_item_ID - 1].price
              );
            } else if (response.action === "No") {
              console.log("See you next time!");
              connection.end();
            }
          });
      } else {
        console.log("Insufficient quantity! Let's start over shall we?");
        initialize();
      }
    }
  );
}

function updateDatabase(
  database_item_id,
  database_stock_quantity,
  response_quantity,
  product_name,
  price
) {
  let query = connection.query(
    "UPDATE products SET stock_quantity = ? WHERE item_id=?",
    [database_stock_quantity - response_quantity, database_item_id],
    function(err, res) {
      console.log("--------------------------------------------------");
      console.log(
        `You purchased ${response_quantity} orders of ${product_name}!`
      );
      console.log(`The total cost: ${response_quantity * price} dollars`);
      console.log(
        `Updated stock of ${product_name}: ${database_stock_quantity -
          response_quantity}`
      );
      buyAgain();
    }
  );
}

function buyAgain() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Return to the beginning?",
      choices: ["Yes", "No"]
    })
    .then(function(response) {
      console.log("--------------------------------------------------");
      if (response.action === "Yes") {
        initialize();
      } else if (response.action === "No") {
        console.log("See you next time!");
        connection.end();
      }
    });
}
