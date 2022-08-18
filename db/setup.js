export const setup = database => `
  CREATE DATABASE ${database};
  
  USE ${database};
  
  CREATE TABLE departments (
    id SERIAL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE roles (
    id SERIAL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  CREATE TABLE employees (
    id SERIAL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id BIGINT UNSIGNED,
    manager_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES roles(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id)
  );
  `;
