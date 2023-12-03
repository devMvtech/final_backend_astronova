const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
