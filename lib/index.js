import inquirer from "inquirer";
import autoComplete from "inquirer-autocomplete-prompt";
import { db } from "../db/index.js";
import employee from "./employee.js";

inquirer.registerPrompt("autocomplete", autoComplete);

export const query = async (query, params) => {
  const connection = await db;
  const [result] = await connection.query(query, params);
  return result;
};

export const display = (data) => {
  console.table("\n", data);
};

// Take an array of questions to use with inquirer prompt
export const prompt = async (prompts) => {
  // Prompt user and get answers
  const answers = await inquirer.prompt(prompts);
  // If answers has a property of function (and is a function) then run it an wait for it to finish
  if (typeof answers["function"] === "function") await answers["function"]();
  return answers;
};

function exit() {
  process.exit();
}

const promptMainMenu = async () => {
  const prompts = [
    {
      type: "list",
      choices: [
        new inquirer.Separator(" "),
        { name: "Manage Employees", value: employee },
        { name: "Exit", value: exit },
      ],
      name: "function",
      message: "Main menu",
    },
  ];

  await prompt(prompts);
};

export default promptMainMenu;
