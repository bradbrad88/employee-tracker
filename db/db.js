import mysql from "mysql2/promise";
import { setup } from "./setup.js";

const { HOST, DATABASE, USR, PORT } = process.env;

if (!DATABASE) throw new Error("Missing database environment variable");

const connection = new Promise(async (resolve, reject) => {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      // database: DATABASE,
      user: USR,
      port: PORT,
      multipleStatements: true,
    });
    await connection.connect();

    const [databases] = await connection.query(
      `show databases where \`database\` = '${DATABASE}'`
    );
    if (databases.length < 1) await setupDatabase(connection);
    await connection.query(`use ${DATABASE};`);
    resolve(connection);
  } catch (error) {
    console.log(error);
    reject(error);
  }
});

async function setupDatabase(connection) {
  try {
    await connection.query(setup(DATABASE));
  } catch (error) {
    throw error;
  }
}

function query(connection) {
  return async query => {
    const conn = await connection;
    return await conn.query(query);
  };
}

export async function disconnect() {
  const conn = await connection;
  conn.end();
}

export default query(connection);
