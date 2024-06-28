import type { QueryResult } from "mysql2";
import mysql from "mysql2/promise";
import Pocketbase from "pocketbase";
const pool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST!,
  user: process.env.WORD_MYSQL_DB_USERNAME!,
  password: process.env.WORD_MYSQL_DB_PASSWORD!,
  database: process.env.WORD_MYSQL_DB!,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
});

export async function query(
  query: string,
  values?: any[]
): Promise<QueryResult[]> {
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(query, values);

    return rows as QueryResult[];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function connectToPB() {
  const pb = new Pocketbase("https://db-word.arinji.com/");
  const adminEmail = process.env.WORD_PB_EMAIL!;
  const adminPassword = process.env.WORD_PB_PASSWORD!;
  await pb.admins.authWithPassword(adminEmail, adminPassword);
  pb.autoCancellation(false);
  await pb.admins.authRefresh();

  return pb;
}
