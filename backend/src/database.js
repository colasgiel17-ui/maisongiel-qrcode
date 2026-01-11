const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database.sqlite')

let db

function initialize() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err)
        reject(err)
        return
      }
      
      console.log('✅ Connected to SQLite database')
      
      // Création des tables
      db.serialize(() => {
        // Table des participants/avis
        db.run(`
          CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            reviewLink TEXT,
            screenshotPath TEXT,
            ipAddress TEXT,
            deviceFingerprint TEXT,
            verified BOOLEAN DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) console.error('Error creating reviews table:', err)
        })

        // Table des récompenses
        db.run(`
          CREATE TABLE IF NOT EXISTS rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reviewId INTEGER NOT NULL,
            rewardType TEXT NOT NULL,
            rewardLabel TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            used BOOLEAN DEFAULT 0,
            usedAt DATETIME,
            expiresAt DATETIME NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reviewId) REFERENCES reviews(id)
          )
        `, (err) => {
          if (err) console.error('Error creating rewards table:', err)
        })

        // Table des admins
        db.run(`
          CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) console.error('Error creating admins table:', err)
          else {
            // Créer un admin par défaut si aucun n'existe
            const bcrypt = require('bcryptjs')
            const defaultPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'changeme', 10)
            
            db.run(
              'INSERT OR IGNORE INTO admins (username, passwordHash) VALUES (?, ?)',
              [process.env.ADMIN_USERNAME || 'admin', defaultPassword],
              (err) => {
                if (!err) console.log('✅ Default admin account created')
              }
            )
          }
        })

        resolve()
      })
    })
  })
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

module.exports = {
  initialize,
  getDb,
  query,
  run,
  get
}
