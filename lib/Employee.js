import { prompt, display, query, promptMenu } from "./index.js";
import {
  getDepartments,
  getEmployees,
  getPotentialManager,
  getRolesByDepartment,
} from "./util-queries.js";
import { notNull, transformParams, sourceAutocomplete, dbSuccess, dbFail } from "./utils.js";

const viewEmployees = async ({ back }) => {
  const sql = `
    SELECT
      e.id as 'ID',
      CONCAT(e.first_name, ' ', e.last_name) as 'Employee',
      d.name as 'Department',
      r.title as 'Role',
      CONCAT('$', FORMAT(r.salary, 0)) as 'Salary',
      IF(em.id IS NULL, '', CONCAT(em.first_name, ' ', em.last_name)) as 'Manager'
    FROM
        employees e
      LEFT JOIN
        employees em 
          ON e.manager_id = em.id
      LEFT JOIN
        roles r
          ON e.role_id = r.id
      LEFT JOIN
        departments d
          ON r.department_id = d.id;`.trim();
  try {
    const data = await query(sql);
    display(data);
  } catch (error) {
    dbFail();
  }
  await back();
};

const addEmployee = async ({ back }) => {
  const sql = `
    INSERT INTO employees
      (first_name, last_name, role_id, manager_id)
    VALUES
      (?, ?, ?, ?);`.trim();
  const prompts = [
    {
      name: "firstName",
      type: "input",
      message: "Employee first name",
      validate: notNull,
    },
    {
      name: "lastName",
      type: "input",
      message: "Employee last name",
      validate: notNull,
    },
    { name: "department", type: "list", choices: getDepartments },
    { name: "role", type: "list", choices: getRolesByDepartment },
    { name: "manager", type: "list", choices: getPotentialManager },
  ];
  const answers = await prompt(prompts);
  const fields = ["firstName", "lastName", "role", "manager"];
  const params = transformParams(fields, answers);
  try {
    await query(sql, params);
    dbSuccess();
  } catch (error) {
    dbFail();
  }
  await back();
};

const updateEmployee = (field) => {
  return async ({ back }) => {
    const employees = await getEmployees();

    const autoCompleteEmployee = [
      {
        type: "autocomplete",
        source: sourceAutocomplete(employees),
        name: "employee",
      },
      {
        type: "list",
        name: "department",
        choices: getDepartments,
        message: "Which deparment will the be working in?",
      },
      {
        type: "list",
        name: "role",
        choices: getRolesByDepartment,
        message: "Which role will they be taking on?",
      },
      {
        type: "list",
        name: "manager",
        choices: getPotentialManager,
        message: "Who will be their manager?",
      },
    ];

    const { employee, role, manager } = await prompt(autoCompleteEmployee);

    const sql = `
      UPDATE employees
      SET ?? = ?, ?? = ?
      WHERE id=?;`.trim();
    const params = ["role_id", role, "manager_id", manager, employee];
    try {
      await query(sql, params);
      dbSuccess();
    } catch (error) {
      dbFail();
    }
    await back();
  };
};

const deleteEmployee = async ({ back }) => {
  const employees = await getEmployees();
  const sql = `
    DELETE FROM employees
    WHERE id=?`.trim();
  const prompts = {
    type: "autocomplete",
    source: sourceAutocomplete(employees),
    name: "employee",
    message: "Delete employee:",
  };
  const { employee } = await prompt(prompts);
  try {
    await query(sql, employee);
    dbSuccess();
  } catch (error) {
    dbFail();
  }
  await back();
};

const employeeMenu = async (history) => {
  const choices = [
    { name: "View Employees", value: viewEmployees },
    { name: "Add Employee", value: addEmployee },
    { name: "Update Employee Role", value: updateEmployee("role_id") },
    { name: "Delete Employee", value: deleteEmployee },
  ];
  await promptMenu("Manage Employees", choices, history);
};

export default employeeMenu;
