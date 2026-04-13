import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: "postgres",
  password: "@17&03&00@&",
  database: "supermarche",
  client_encoding: "UTF8",
});

// pool.on("connect", () => {
//   console.log("PostgreSQL connecté");
// });
export default pool;
