import { query } from "./index.js";

export const getDepartments = async () => {
  const departmentsSql = `
            SELECT
              id as value,
              name
            FROM
              departments;
          `.trim();
  return await query(departmentsSql);
};

// Get roles from DB to use in inquirer prompt
export const getRoles = async ({ department }) => {
  return await query(
    `SELECT id as value, title as name FROM roles WHERE department_id=?`,
    department
  );
};

// Get a list of employees in the given department for use in inquirer prompt
export const getManager = async ({ department, employee }) => {
  const managers = await query(
    `SELECT e.id as value, concat(first_name, ' ', last_name) as name FROM employees e INNER JOIN roles r ON e.role_id = r.id WHERE r.department_id = ?`,
    department
  );
  managers.push({ name: "No manager", value: null });

  return managers.filter((manager) => manager.value !== employee);
};

export const getEmployees = async () => {
  return await query(`
      SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employees;
    `);
};
