import type { QueryResult } from "mysql2";
import mysql from "mysql2/promise";

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
