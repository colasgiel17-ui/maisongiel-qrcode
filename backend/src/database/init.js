const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '../../database.sqlite')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS participations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    review_link TEXT,
    reward_type TEXT,
    reward_code TEXT,
    reward_used INTEGER DEFAULT 0,
    used_at TEXT,
    created_at TEXT NOT NULL
  )
`)

console.log('✅ Base de données initialisée')

module.exports = db
