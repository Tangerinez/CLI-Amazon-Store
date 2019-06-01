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
      console.log("--------------------------------------------------");
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
          console.log("--------------------------------------------------");
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

function viewLowInventory() {
  let query = connection.query(
    "SELECT item_id, product_name, stock_quantity FROM products",
    function(err, res) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].stock_quantity <= 5) {
          console.log(res[i]);

          inquirer
            .prompt({
              name: "action",
              type: "list",
              message: "What would you like to do next?",
              choices: [
                "View Products for Sale",
                "Add to Inventory",
                "Add New Product",
                "Exit"
              ]
            })
            .then(function(response) {
              console.log("--------------------------------------------------");
              switch (response.action) {
                case "View Products for Sale":
                  viewProducts();
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
      }
    }
  );
}

function addToInventory() {
  let query = connection.query(
    "SELECT item_id, product_name, stock_quantity FROM products",
    function(err, res) {
      console.log(res);
      let productIDs = [];
      let productNames = [];
      let productStocks = [];
      for (var i = 0; i < res.length; i++) {
        productIDs.push(res[i].item_id);
        productNames.push(res[i].product_name);
        productStocks.push(res[i].stock_quantity);
      }
      inquirer
        .prompt([
          {
            name: "action",
            type: "input",
            message:
              "Please enter the item ID of the item you want to add inventory to: ",
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
              "Please enter the number of this product that you would like to add: ",
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
          console.log(typeof response.action);
          for (var j = 0; j < productIDs.length; j++) {
            if (parseInt(response.action) === productIDs[j]) {
              addToProduct(
                productIDs[j],
                productNames[j],
                productStocks[j],
                response.quantity
              );
            }
          }
        });
    }
  );
}

function addToProduct(
  product_ID,
  product_name,
  product_quantity,
  response_quantity
) {
  let query = connection.query(
    "UPDATE products SET stock_quantity = ? WHERE item_id=?",
    [product_quantity + parseInt(response_quantity), product_ID],
    function(err, res) {
      console.log("--------------------------------------------------");
      console.log(
        `You added ${response_quantity} ${product_name}s to the existing inventory!`
      );
      console.log(
        `New Stock Quantity of ${product_name}s: ${product_quantity +
          parseInt(response_quantity)}`
      );

      inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "What would you like to do next?",
          choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory again",
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
            case "Add to Inventory again":
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

function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Please enter the name of the product you want to add: ",
        validate: function(value) {
          if (typeof value === "string") {
            return true;
          }
          console.log("Please enter a valid product name");
          return false;
        }
      },
      {
        name: "category",
        type: "input",
        message: "Please enter category this product falls under: ",
        validate: function(value) {
          if (typeof value === "string") {
            return true;
          }
          console.log("Please enter a valid category name!");
          return false;
        }
      },
      {
        name: "department",
        type: "input",
        message: "Please enter department this product falls under: ",
        validate: function(value) {
          if (typeof value === "string") {
            return true;
          }
          console.log("Please enter a valid department name!");
          return false;
        }
      },
      {
        name: "price",
        type: "input",
        message: "Please enter price of this product: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          console.log("Please enter a whole number");
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "Please enter how much of this product you're adding: ",
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
      let query = connection.query(
        "INSERT INTO products (product_name, category, department_name, price, stock_quantity) VALUES (?,?,?,?,?)",
        [
          response.name,
          response.category,
          response.department,
          response.price,
          response.quantity
        ],
        function(err, res) {
          console.log("--------------------------------------------------");
          console.log(`You have just added the following item to the products table: 
Product Name: ${response.name}
Category: ${response.category}
Department: ${response.department}
Price: ${response.price}
Quantity: ${response.quantity}`);

          inquirer
            .prompt({
              name: "action",
              type: "list",
              message: "What would you like to do next?",
              choices: [
                "Add another product",
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
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
                case "Add another product":
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
    });
}
