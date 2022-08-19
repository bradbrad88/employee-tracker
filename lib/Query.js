import inquirer from "inquirer";
import query from "../db/index.js";

class Query {
  constructor(name, getSql, setSql, setPrompts) {
    this.name = name;
    this.getSql = getSql;
    this.setSql = setSql;
    this.setPrompts = setPrompts;
  }
  getQuery = async () => {
    return await query(this.getSql);
  };

  setQuery = async () => {
    const item = await inquirer.prompt(this.setPrompts);
    // Transform the inquirer results from an object to an array ordered by query inputs
    const fields = this.fields || this.setPrompts.map((prompt) => prompt.name);
    const params = fields.map((field) => item[field]);
    await query(this.setSql, params);
  };
}

export default Query;
