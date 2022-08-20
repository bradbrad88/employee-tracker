import { display, promptMenu, query, prompt } from "./index.js";
import { notNull } from "./utils.js";

const viewDepartments = async ({ back }) => {
  const sql = `
    SELECT
      d.id as 'ID',
      d.name as 'Department'
    FROM
      departments d;`.trim();
  const data = await query(sql);
  display(data);
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
  await query(sql, name);
  await back();
};

const viewSalaries = async ({ back }) => {
  const sql = `
    SELECT
      d.name as 'Department',
      SUM(r.salary) as 'Total Salary'
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
  const data = await query(sql);
  display(data);
  await back();
};

const departmentMenu = async (history) => {
  const choices = [
    { name: "View Departments", value: viewDepartments },
    { name: "Add Department", value: addDepartment },
    { name: "View Department Total Salaries", value: viewSalaries },
  ];
  await promptMenu("Manage Departments", choices, history);
};

export default departmentMenu;
