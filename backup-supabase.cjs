const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.bggqklkeqdmkefvrjuka.supabase.co', port: 5432, user: 'postgres',
  password: 'sjFicjkNd7BpGhul', database: 'postgres', ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected - Starting backup...');

  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const tables = [
    'blog_articles', 'site_hero', 'site_about', 'site_testimonials',
    'site_units', 'site_treatments', 'site_seo', 'site_privacy', 'golden_referrals'
  ];

  const timestamp = new Date().toISOString().split('T')[0];
  const backup = {};

  for (const table of tables) {
    try {
      const { rows } = await client.query(`SELECT * FROM ${table}`);
      backup[table] = rows;
      console.log(`  ${table}: ${rows.length} registros`);
    } catch (e) {
      console.log(`  ${table}: ERRO - ${e.message.substring(0, 50)}`);
      backup[table] = [];
    }
  }

  // Also backup storage file list
  try {
    const { rows } = await client.query("SELECT id, name, bucket_id, created_at FROM storage.objects WHERE bucket_id = 'blog-images' ORDER BY created_at DESC");
    backup['storage_files'] = rows;
    console.log(`  storage_files: ${rows.length} arquivos`);
  } catch (e) {
    console.log(`  storage_files: ${e.message.substring(0, 50)}`);
    backup['storage_files'] = [];
  }

  const filePath = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf-8');
  console.log(`\nBackup salvo em: ${filePath}`);

  // Summary
  const totalRecords = Object.values(backup).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`Total: ${totalRecords} registros em ${tables.length} tabelas + storage`);

  await client.end();
  console.log('Done!');
}

run().catch(e => console.error('Error:', e.message));
