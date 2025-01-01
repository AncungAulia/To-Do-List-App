const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "ancung04042006",
  host: "localhost",
  port: 5432,
  database: "todo_app",
});

module.exports = pool;
