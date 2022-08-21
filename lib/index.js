import inquirer from "inquirer";
import autoComplete from "inquirer-autocomplete-prompt";
import { db } from "../db/index.js";
import employeeMenu from "./Employee.js";
import departmentMenu from "./Department.js";
import roleMenu from "./Role.js";

inquirer.registerPrompt("autocomplete", autoComplete);

const MENU_ITEM = "menuItem";

export const query = async (query, params) => {
  const connection = await db;
  const [result] = await connection.query(query, params);
  return result;
};

export const display = (data) => {
  console.table("", data);
};

// Take an array of questions to use with inquirer prompt
export const prompt = async (prompts) => {
  // Manage prompt history to dynamically render 'back' button
  const processedPrompts = processPrompts(prompts);
  // Prompt user and get answers
  const answers = await inquirer.prompt(processedPrompts);
  // If answers has a property of function (and is a function) then run it an wait for it to finish
  if (typeof answers[MENU_ITEM] === "function") await answers[MENU_ITEM](processedPrompts);
  return answers;
};

function processPrompts(prompts) {
  // Don't process 'back' properties on a prompt that has already been processed
  if (prompts.goingBack) return { ...prompts };
  // Only want to look at menu navigation here - ignore prompts for data
  if (prompts.name !== MENU_ITEM) return prompts;

  const history = prompts.history;

  if (!history || typeof history !== "object") return { ...prompts, back: back(prompts) };

  // Insert a 'back' option on menus that are able to go back, place it just above 'exit'
  const choices = [...prompts.choices];
  choices.splice(prompts.choices.length - 1, 0, {
    name: "Back",
    value: back(history),
  });
  const processedPrompts = {
    ...prompts,
    choices,
  };
  // Provide a 'back' api to non-menu functions
  processedPrompts.back = back(processedPrompts);
  return processedPrompts;
}

function back(prompts) {
  return async () => {
    prompts.goingBack = true;
    await prompt(prompts);
  };
}

function exit() {
  process.exit();
}

// Format options to create consistent menus with 'back' and 'exit' options
export const promptMenu = async (menuTitle, choices, history) => {
  choices.push(new inquirer.Separator("- ".repeat(10)));
  choices.push({ value: exit, name: "Exit" });

  const prompts = {
    name: MENU_ITEM,
    type: "list",
    message: menuTitle,
    choices,
    history,
  };
  await prompt(prompts);
};

const mainMenu = async () => {
  const choices = [
    { name: "Manage Employees", value: employeeMenu },
    { name: "Manage Departments", value: departmentMenu },
    { name: "Manage Roles", value: roleMenu },
  ];
  await promptMenu("Main Menu", choices);
};

export default mainMenu;
