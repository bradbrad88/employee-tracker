// Use environment variables in .env file to initialise database
import "dotenv/config";
import "console.table";
import inquirer from "inquirer";
import chalk from "chalk";
import { Role, Department, Employee } from "../lib/index.js";

const promptMainMenu = async () => {
  // Prepare an instance of each class type to be used in main menu
  const [role, employee, department] = [new Role(), new Employee(), new Department()];

  // Each menu item stores a function as its value so that it can be run after the prompt
  const { menu } = await inquirer.prompt([
    {
      type: "list",
      choices: [
        new inquirer.Separator(" "),
        { name: "View all departments", value: handleGet(department.getQuery) },
        { name: "View all roles", value: handleGet(role.getQuery) },
        { name: "View all employees", value: handleGet(employee.getQuery) },
        { name: "Add a department", value: handleSet(department.setQuery) },
        { name: "Add a role", value: handleSet(role.setQuery) },
        { name: "Add an employee", value: handleSet(employee.setQuery) },
        { name: "Update an employee role", value: "updateEmployee" },
        { name: "Exit", value: exit },
      ],
      name: "menu",
      message: "Main menu",
    },
  ]);
  console.log("-".repeat(50) + "\n");
  await menu();
};

function exit() {
  process.exit();
}

function handleGet(callback) {
  return async () => {
    const result = await callback();
    console.log("\n");
    console.table(result);
  };
}

function handleSet(callback) {
  return async () => {
    await callback();
    console.log(chalk.green("\nItem added to database\n"));
  };
}

async function init() {
  while (true) {
    await promptMainMenu();
  }
}

init();
