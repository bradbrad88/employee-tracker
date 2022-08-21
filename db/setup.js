export const setup = (database) => `
  CREATE DATABASE ${database};
  
  USE ${database};
  
  CREATE TABLE departments (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE roles (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES departments(id)
    ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE employees (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES roles(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(manager_id) REFERENCES employees(id)
    ON DELETE SET NULL ON UPDATE CASCADE
  );
  `;

export const seed = () => `
    INSERT INTO departments
      (name)
    VALUES
      ('Accounting'),
      ('Marketing'),
      ('Human Resources');

    INSERT INTO roles
      (title, salary, department_id)
    VALUES
      ('Chief Accountant', 100000, 1),
      ('Account Manager ', 70000, 1),
      ('Chief of Marketing', 160000, 2),
      ('Sales Manager', 112000, 2),
      ('Junior Marketing Consultant', 86000, 2),
      ('HR Director', 130000, 3),
      ('Diversity Officer', 90000, 3);

    INSERT INTO employees
      (first_name, last_name, role_id, manager_id)
    VALUES
      ('Anabel', 'Strickland', 1, NULL),
      ('Mackenzie', 'Mclaughlin', 2, 1),
      ('Raquel', 'Peters', 3, NULL),
      ('Cristian', 'Manning', 4, 3),
      ('Rebecca', 'Velazquez', 6, Null),
      ('Mark', 'Lopez', 5, 3),
      ('Jess', 'Grove', 7, 5),
      ('Rajvinder', 'Singh', 5, 3),
      ('Allan', 'Cabel', 2, 1);
  `;
