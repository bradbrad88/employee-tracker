import mysql from "mysql2/promise";
import { setup, seed } from "./setup.js";

const { HOST, DATABASE, USR, PORT, PASS, NODE_ENV } = process.env;

if (!DATABASE) throw new Error("Missing database environment variable");

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      user: USR,
      port: PORT,
      password: PASS,
      multipleStatements: true,
    });
    return connection;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const db = new Promise(async (resolve, reject) => {
  try {
    const conn = await createConnection();
    const [databases] = await conn.query(`show databases where \`database\` = '${DATABASE}'`);
    if (databases.length < 1) await setupDatabase(conn);
    await conn.query(`use ${DATABASE};`);
    resolve(conn);
  } catch (error) {
    reject(false);
  }
});

async function setupDatabase(connection) {
  try {
    await connection.query(setup(DATABASE));
    if (NODE_ENV === "production") return;
    await connection.query(seed());
  } catch (error) {
    throw error;
  }
}

async function query(query, params) {
  try {
    const connection = await conn;
    const [result] = await connection.query(query, params);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export default query;
