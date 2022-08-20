import chalk from "chalk";
import fuzzy from "fuzzy";
import { prompt, display, query, promptMenu } from "./index.js";
import { getDepartments, getEmployees, getManager, getRoles } from "./util-queries.js";
import { notNull, transformParams } from "./utils.js";

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
    { name: "role", type: "list", choices: getRoles },
    { name: "manager", type: "list", choices: getManager },
  ];
  const answers = await prompt(prompts);
  const fields = ["firstName", "lastName", "role", "manager"];
  const params = transformParams(fields, answers);

  await query(sql, params);
  await back();
};

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
          ON r.department_id = d.id;`;
  const data = await query(sql);
  display(data);
  await back();
};

const updateEmployee = (field) => {
  return async ({ back }) => {
    const employees = await getEmployees();

    const autoCompleteEmployee = [
      {
        type: "autocomplete",
        source: (_, input = "") => {
          return new Promise((resolve) => {
            const employeesFiltered = fuzzy
              .filter(input, employees, {
                extract: (el) => el.name,
              })
              .map((el) => el.original);
            resolve(employeesFiltered);
          });
        },
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
        choices: getRoles,
        message: "Which role will they be taking on?",
      },
      {
        type: "list",
        name: "manager",
        choices: getManager,
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
      console.log(chalk.green(`\nUpdated employee role successfully\n`));
    } catch (error) {}
    await back();
  };
};

const employeeMenu = async (history) => {
  const choices = [
    { name: "View Employees", value: viewEmployees },
    { name: "Add Employee", value: addEmployee },
    { name: "Update Employee Role", value: updateEmployee("role_id") },
  ];
  await promptMenu("Manage Employees", choices, history);
};

export default employeeMenu;
