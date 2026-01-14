const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Middleware basique de validation email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// POST /api/clients/bon - Enregistrer un nouveau bon client
router.post('/bon', async (req, res) => {
  try {
    const { name, email, reward, code } = req.body;

    // Validation
    if (!name || !email || !reward || !code) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Email invalide.' });
    }

    // Insertion dans Supabase
    // On suppose que la table s'appelle 'participations' pour garder la cohérence avec l'existant, ou 'clients_bons' si on veut séparer.
    // Utilisons 'clients_bons' pour être spécifique à ta demande de "bons clients" permanente.
    // Si la table n'existe pas, il faudra la créer dans Supabase.
    
    const { data, error } = await supabase
      .from('participations') // On réutilise 'participations' pour avoir l'historique complet
      .insert([
        { 
          name, 
          email, 
          reward_type: reward, 
          reward_code: code,
          reward_used: false,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    res.status(201).json({ success: true, data: data[0] });

  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement.' });
  }
});

// GET /api/clients/liste - Récupérer tous les bons clients
router.get('/liste', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('participations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    console.error('Erreur récupération:', err);
    res.status(500).json({ success: false, message: 'Impossible de récupérer la liste.' });
  }
});

module.exports = router;
