const { createClient } = require('@supabase/supabase-js');

// Vérification des variables d'environnement
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('⚠️  ERREUR CRITIQUE : Les variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont manquantes.');
}

// Initialisation du client avec la clé SERVICE_ROLE pour contourner les règles RLS côté serveur
// ATTENTION : Ne jamais utiliser cette clé côté frontend !
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
