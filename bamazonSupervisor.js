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
  viewProductSales();
});

function initialize() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Menu Options",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit"
      ]
    })
    .then(function(response) {
      console.log("--------------------------------------------------");
      switch (response.action) {
        case "View Product Sales by Department":
          viewProductSales();
          break;
        case "Create New Department":
          createNewDepartment();
          break;
        case "Exit":
          console.log("Goodbye supervisor!");
          connection.end();
          break;
      }
    });
}

function viewProductSales() {
  let query = connection.query(
    "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments JOIN products ON departments.department_id = products.item_id",
    function(err, res) {
      for (var i = 0; i < res.length; i++) {
        addTotalProfit(res[i], res[i].product_sales, res[i].over_head_costs);
      }
      console.log(res);
    }
  );
}

function addTotalProfit(departmentObject, sales, overHeadCosts) {
  departmentObject.total_profit = sales - overHeadCosts;
}
