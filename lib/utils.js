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
