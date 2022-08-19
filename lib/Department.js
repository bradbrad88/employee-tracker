import Query from "./Query.js";

export class Department extends Query {
  constructor() {
    const name = "Department";
    const getSql = `
      SELECT
        d.id as 'ID',
        d.name as '${name}'
      FROM
        departments d; 
    `.trim();
    const setSql = `
      INSERT INTO departments
        (name)
      VALUES
        (?);    
    `.trim();
    const prompts = [{ name: "department", message: "Department name:", type: "input" }];
    super(name, getSql, setSql, prompts);
  }
}
