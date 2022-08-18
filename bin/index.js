import _dotenv from "dotenv/config";
import query, { disconnect } from "../db/db.js";

async function initDb() {
  try {
    const [results] = await query(`show tables;`);
    console.log(results);
  } catch (error) {
    console.log(error);
  }
  return;
}

async function init() {
  await initDb();
  await disconnect();
}

init();
