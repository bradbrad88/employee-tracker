import { display, promptMenu, query, prompt } from "./index.js";
import { getDepartments, getRoles } from "./util-queries.js";
import {
  notNull,
  transformParams,
  numKey,
  dbFail,
  dbSuccess,
  sourceAutocomplete,
} from "./utils.js";

const viewRoles = async ({ back }) => {
  const sql = `
    SELECT
      r.id as 'ID',
      r.title as 'Role',
      r.salary as 'Salary',
      d.name as 'Department'
    FROM
        roles r
      LEFT JOIN
        departments d
          ON r.department_id = d.id;`.trim();
  const data = await query(sql);
  display(data);
  await back();
};

const addRole = async ({ back }) => {
  const sql = `      
    INSERT INTO roles
      (title, salary, department_id)
    VALUES
      (?, ?, ?)`.trim();
  const prompts = [
    { name: "title", message: "Role title:", type: "input", validate: notNull },
    {
      name: "salary",
      message: "Role salary:",
      type: "input",
      validate: numKey,
    },
    { name: "department", choices: getDepartments, type: "list" },
  ];
  const answers = await prompt(prompts);
  const fields = ["title", "salary", "department"];
  const params = transformParams(fields, answers);
  try {
    await query(sql, params);
    dbSuccess();
  } catch (error) {
    dbFail();
  }
  await back();
};

const deleteRole = async ({ back }) => {
  const roles = await getRoles();
  const sql = `
    DELETE FROM roles
    WHERE id=?`.trim();
  const prompts = [
    {
      type: "autocomplete",
      source: sourceAutocomplete(roles),
      name: "role",
      message: "Delete role:",
    },
  ];
  const { role } = await prompt(prompts);

  try {
    await query(sql, role);
    dbSuccess("deleted from");
  } catch (error) {
    console.log(error);
    dbFail();
  }
  await back();
};

const roleMenu = async (history) => {
  const choices = [
    { name: "View Roles", value: viewRoles },
    { name: "Add Role", value: addRole },
    { name: "Delete Role", value: deleteRole },
  ];
  await promptMenu("Manage Roles", choices, history);
};

export default roleMenu;
