import { prompt, display, query, promptMenu } from "./index.js";
import {
  getDepartments,
  getEmployeeDetails,
  getEmployees,
  getManagers,
  getPotentialManager,
  getRolesByDepartment,
} from "./util-queries.js";
import {
  notNull,
  transformParams,
  sourceAutocomplete,
  dbSuccess,
  dbFail,
  alignCurrency,
} from "./utils.js";

const viewEmployees = async ({ back }) => {
  const sql = `
    SELECT
      e.id as 'ID',
      CONCAT(e.first_name, ' ', e.last_name) as 'Employee',
      d.name as 'Department',
      r.title as 'Role',
      FORMAT(r.salary, 0) as 'Salary',
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
    const formattedData = alignCurrency("Salary", data);
    display(formattedData);
  } catch (error) {
    dbFail();
  }
  await back();
};

const viewEmployeesByManager = async ({ back }) => {
  const managers = await getManagers();
  const prompts = {
    type: "autocomplete",
    source: sourceAutocomplete(managers),
    name: "manager",
    message: "Select a manager:",
  };
  const { manager } = await prompt(prompts);
  const sql = `
    SELECT
      e.id as 'ID',
      CONCAT(first_name, ' ', last_name) as 'Name',
      title as 'Position',
      FORMAT(salary, 0) as 'Salary'
    FROM
        employees e
      INNER JOIN
        roles r
          ON e.role_id = r.id
    WHERE manager_id=?
  `;
  const data = await query(sql, manager);
  const formattedData = alignCurrency("Salary", data);
  display(formattedData);
  await back();
};

const viewEmployeesByDepartment = async ({ back }) => {
  try {
    const departments = await getDepartments();
    const prompts = {
      type: "autocomplete",
      source: sourceAutocomplete(departments),
      name: "department",
      message: "Select a department:",
    };
    const { department } = await prompt(prompts);
    const sql = `
    SELECT
      e.id as 'ID',
      CONCAT(first_name, ' ', last_name) as 'Name',
      title as 'Position',
      FORMAT(salary, 0) as 'Salary'
    FROM
        employees e
      INNER JOIN
        roles r
          ON e.role_id = r.id
    WHERE r.department_id=?
    ORDER BY salary
  `;

    const data = await query(sql, department);
    const formattedData = alignCurrency("Salary", data);
    display(formattedData);
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

const updateEmployeeRole = async ({ back }) => {
  const employees = await getEmployees();

  const prompts = [
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

  const { employee, role, manager } = await prompt(prompts);

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

const updateEmployeeManager = async ({ back }) => {
  try {
    // Get a list of all employees
    const employees = await getEmployees();

    // Prompt user for employee to edit
    const employeePrompt = {
      type: "autocomplete",
      source: sourceAutocomplete(employees),
      name: "employee",
      message: "Select the employee to update:",
    };
    const { employee } = await prompt(employeePrompt);

    // Get department of selected employee
    const { department } = await getEmployeeDetails(employee);

    // Get list of potential managers that work in employee's department
    const managers = await getPotentialManager({ department, employee });

    // Prompt user for the new manager
    const managerPrompt = {
      type: "autocomplete",
      name: "manager",
      source: sourceAutocomplete(managers),
      message: "Who will be their manager?",
    };
    const { manager } = await prompt(managerPrompt);

    // Update database
    const sql = `
    UPDATE employees
    SET manager_id = ?
    WHERE id = ?;`.trim();
    const params = [manager, employee];

    await query(sql, params);
    dbSuccess();
  } catch (error) {
    dbFail();
  }
  await back();
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
    { name: "View Employees By Manager", value: viewEmployeesByManager },
    { name: "View Employees By Department", value: viewEmployeesByDepartment },
    { name: "Add Employee", value: addEmployee },
    { name: "Update Employee Role", value: updateEmployeeRole },
    { name: "Update Employee Manager", value: updateEmployeeManager },
    { name: "Delete Employee", value: deleteEmployee },
  ];
  await promptMenu("Manage Employees", choices, history);
};

export default employeeMenu;
