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

export const dbSuccess = (str = "Item successfully added to database") => {
  console.clear();
  console.log(chalk.green(`\n${str}\n`));
};

export const dbFail = (str = "Action failed") => {
  console.clear();
  console.log(chalk.red(`\n${str}\n`));
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

export const alignCurrency = (title, data) => {
  const maxString = data.reduce((p, c) => Math.max(p, c[title].length + 2), title.length);
  return data.map((el) => {
    const str = "$" + el[title].padStart(maxString - 1, " ");
    return { ...el, [title]: str };
  });
};
