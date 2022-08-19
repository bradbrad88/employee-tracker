import Query from "./Query.js";
import query from "../db/index.js";

export class Role extends Query {
  constructor() {
    const name = "Role";
    const getSql = `
    SELECT
    r.id as 'ID',
    r.title as 'Role',
    r.salary as 'Salary',
    d.name as 'Department'
  FROM
      roles r
    LEFT JOIN
      departments d
        ON r.department_id = d.id;
    `;
    const setSql = `
      INSERT INTO roles
        (title, salary, department_id)
      VALUES
        (?, ?, ?)
    `;
    const prompts = [
      { name: "title", message: "Role title:", type: "input" },
      {
        name: "salary",
        message: "Role salary:",
        type: "input",
        prefix: "$",
        validate: numKey,
      },
      { name: "department", choices: getDepartments, type: "list" },
    ];
    super(name, getSql, setSql, prompts);
  }
}

// Helper function
function numKey(str) {
  if (!str) return "Salary can not be zero";
  return /\D/gi.test(str) ? "Please only use digits (0 - 9)" : true;
}

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
