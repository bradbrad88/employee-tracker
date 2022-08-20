import { prompt, display, query } from "./Query.js";

import { getDepartments, getEmployees, getManager, getRoles } from "./util-queries.js";

// Helper function to validate string has content
const notNull = (str) => {
  if (!str) return "Can not be an empty string";
  return true;
};

const addEmployee = async () => {
  const sql = `
      INSERT INTO employees
        (first_name, last_name, role_id, manager_id)
      VALUES
        (?, ?, ?, ?);
    `.trim();
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
    { name: "role", type: "list", choices: getRoles },
    { name: "manager", type: "list", choices: getManager },
  ];
  const answers = await prompt(prompts);
  const params = ["firstName", "lastName", "role", "manager"].map((field) => answers[field]);

  await Employee.query(sql, params);
};

const viewEmployees = async () => {
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
            ON r.department_id = d.id;`;
  const data = await query(sql);
  display(data);
};

const updateEmployee = async (field) => {
  const employees = await getEmployees();
  console.log(employees);
  const sql = `
      UPDATE employees
      SET ??
      WHERE id=?
    `;
};

const manage = async () => {
  const prompts = [
    {
      choices: [
        { name: "View Employees", value: viewEmployees },
        { name: "Add Employee", value: addEmployee },
        { name: "Update Employee Role", value: updateEmployee("role_id") },
      ],
      type: "list",
      message: "Manage Employees",
      name: "function",
    },
  ];
  await prompt(prompts);
};

export default manage;
