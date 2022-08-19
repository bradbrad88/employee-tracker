import Query from "./Query.js";
import query from "../db/index.js";

export class Employee extends Query {
  constructor() {
    const name = "Employee";
    const getSql = `
      SELECT
        e.id as 'ID',
        CONCAT(e.first_name, ' ', e.last_name) as '${name}',
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
            ON r.department_id = d.id;    
    `;
    const setSql = `
      INSERT INTO employees
        (first_name, last_name, role_id, manager_id)
      VALUES
        (?, ?, ?, ?)
    `;
    const prompts = [
      { name: "firstName", type: "input", message: "Employee first name", validate: notNull },
      { name: "lastName", type: "input", message: "Employee last name", validate: notNull },
      { name: "department", type: "list", choices: getDepartments },
      { name: "role", type: "list", choices: getRoles },
      { name: "manager", type: "list", choices: getManager },
    ];

    super(name, getSql, setSql, prompts);
    this.fields = ["firstName", "lastName", "role", "manager"];
  }
}

// Helper function to validate string has content
function notNull(str) {
  if (!str) return "Can not be an empty string";
  return true;
}

// Get departments from DB to use in inquirer prompt
async function getDepartments() {
  const departmentsSql = `
          SELECT
            id as value,
            name
          FROM
            departments;
        `.trim();
  return await query(departmentsSql);
}

// Get roles from DB to use in inquirer prompt
async function getRoles({ department }) {
  return await query(
    `SELECT id as value, title as name FROM roles WHERE department_id=?`,
    department
  );
}

// Get a list of employees in the given department for use in inquirer prompt
async function getManager({ department }) {
  const employees = await query(
    `SELECT e.id as value, concat(first_name, ' ', last_name) as name FROM employees e INNER JOIN roles r ON e.role_id = r.id WHERE r.department_id = ?`,
    department
  );
  employees.push({ name: "No manager", value: null });
  return employees;
}
