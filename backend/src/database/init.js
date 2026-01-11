```javascript
// ...existing code...

  // Ajouter la colonne reward_used si elle n'existe pas
  try {
    db.exec(`
      ALTER TABLE participations 
      ADD COLUMN reward_used INTEGER DEFAULT 0
    `)
    console.log('✅ Colonne reward_used ajoutée')
  } catch (error) {
    // La colonne existe déjà, c'est normal
  }

  try {
    db.exec(`
      ALTER TABLE participations 
      ADD COLUMN used_at TEXT
    `)
    console.log('✅ Colonne used_at ajoutée')
  } catch (error) {
    // La colonne existe déjà, c'est normal
  }

// ...existing code...
```