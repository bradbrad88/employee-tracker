# Employee Tracker

[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)
![Github Top Language](https://img.shields.io/github/languages/top/bradbrad88/employee-tracker)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## Description

A command line application for managing employees within a company.

This application allows users to add, modify and delete employees, their roles and departments.

It also provides reports on department salary budgets, lists of staff that report to each manager and lists of staff that belong to each department.

[Github repo](https://github.com/bradbrad88/employee-tracker).

[Demonstration video](https://drive.google.com/file/d/1G6iAw-Qax4LExBga9fiJVuC1W4VVDNZR/view?usp=sharing).

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

```bash
npm i -g https://github.com/bradbrad88/employee-tracker
```

## Usage

To run the program, run the following command from any location:

```bash
team
```

Enviroment variables are required to connect to database, use the following variable names with your own required values (DATABASE can be anything you like):

- USR=root
- DATABASE=employee_tracker
- HOST=127.0.0.1
- PORT=3306
- PASS=

This can be prepended to the 'team' command as such:

```bash
USR=root PORT=3306 DATABASE=employee_tracker HOST=127.0.0.1 NODE_ENV=production team
```

Or create a .env file in the directory that you launch the application from.

Use NODE_ENV=production to avoid seeding unwanted data into the database.

Navigate within the app using arrow keys.

Exit at any time with ctrl-c, or the exit menu options.

## License

Project license: [MIT](https://opensource.org/licenses/MIT). Copyright Brad Teague 2022

## Questions

For any questions about the project, please raise an issue at [this issues page](https://github.com/bradbrad88/employee-tracker/issues).

For any further questions you can contact me [here](b_rad88@live.com).
