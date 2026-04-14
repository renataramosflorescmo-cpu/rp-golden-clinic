const { Client } = require('pg');
const client = new Client({
  host: 'db.bggqklkeqdmkefvrjuka.supabase.co', port: 5432, user: 'postgres',
  password: 'sjFicjkNd7BpGhul', database: 'postgres', ssl: { rejectUnauthorized: false }
});
async function run() {
  await client.connect();
  const { rows } = await client.query('SELECT DISTINCT category FROM blog_articles ORDER BY category');
  console.log('Categories in DB:', rows.map(r => r.category));

  // Check for constraint on category
  const { rows: constraints } = await client.query("SELECT conname, consrc FROM pg_constraint WHERE conrelid = 'blog_articles'::regclass");
  console.log('Constraints:', constraints);

  await client.end();
}
run().catch(e => console.error(e.message));
