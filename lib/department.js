import { display, promptMenu, query, prompt } from "./index.js";
import { getDepartments } from "./util-queries.js";
import { alignCurrency, dbFail, dbSuccess, notNull, sourceAutocomplete } from "./utils.js";

const viewDepartments = async ({ back }) => {
  const sql = `
    SELECT
      d.id as 'ID',
      d.name as 'Department'
    FROM
      departments d;`.trim();
  try {
    const data = await query(sql);
    display(data);
  } catch (error) {
    dbFail();
  }
  await back();
};

const addDepartment = async ({ back }) => {
  const sql = `
    INSERT INTO departments
      (name)
    VALUES
      (?);`.trim();
  const prompts = [
    {
      type: "input",
      name: "name",
      message: "Provide a name for the new department:",
      validate: notNull,
    },
  ];
  const { name } = await prompt(prompts);
  try {
    await query(sql, name);
    dbSuccess();
  } catch (error) {
    dbFail();
  }
  await back();
};

const viewSalaries = async ({ back }) => {
  const sql = `
    SELECT
      d.name as 'Department',
      FORMAT(SUM(r.salary), 0) as 'Total Salary'
    FROM
        departments d
      INNER JOIN
        roles r
          ON d.id = r.department_id
      INNER JOIN
        employees e
          ON r.id = e.role_id
    GROUP BY
      d.id;`.trim();
  try {
    const data = await query(sql);
    const formattedData = alignCurrency("Total Salary", data);
    display(formattedData);
  } catch (error) {
    dbFail();
  }
  await back();
};

const deleteDepartment = async ({ back }) => {
  const departments = await getDepartments();
  const sql = `
    DELETE FROM departments
    WHERE id=?`.trim();
  const prompts = {
    type: "autocomplete",
    source: sourceAutocomplete(departments),
    name: "department",
    message: "Delete department:",
  };
  const { department } = await prompt(prompts);
  try {
    await query(sql, department);
    dbSuccess("deleted from");
  } catch (error) {
    dbFail();
  }
  await back();
};

const departmentMenu = async (history) => {
  const choices = [
    { name: "View Departments", value: viewDepartments },
    { name: "Add Department", value: addDepartment },
    { name: "View Department Budget", value: viewSalaries },
    { name: "Delete Department", value: deleteDepartment },
  ];
  await promptMenu("Manage Departments", choices, history);
};

export default departmentMenu;