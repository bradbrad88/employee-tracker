import chalk from "chalk";
import fuzzy from "fuzzy";

export const notNull = (str) => {
  if (!str) return "Can not be an empty string";
  return true;
};

export const numKey = (str) => {
  if (!str) return "Salary can not be zero";
  return /\D/gi.test(str) ? "Please only use digits (0 - 9)" : true;
};

export const transformParams = (arr, answers) => {
  return arr.map((field) => answers[field]);
};

export const dbSuccess = (str = "added to") => {
  console.log(chalk.green(`\nItem successfully ${str} database\n`));
};

export const dbFail = () => {
  console.log(chalk.red("\nFailed to add item to database\n"));
};

export const sourceAutocomplete = (arr, field = "name") => {
  return async (_, input = "") => {
    const arrFiltered = fuzzy
      .filter(input, arr, {
        extract: (el) => el[field],
      })
      .map((el) => el.original);
    return arrFiltered;
  };
};
