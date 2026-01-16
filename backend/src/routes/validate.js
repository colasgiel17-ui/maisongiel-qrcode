const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// 🎁 Page publique de validation d'un QR code
// URL: /validate/:code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    console.log('🔍 Validation publique du code:', code);

    // Chercher dans Supabase
    const { data: participation, error } = await supabase
      .from('participations')
      .select('*')
      .eq('reward_code', code)
      .single();

    if (error || !participation) {
      return res.status(404).json({
        success: false,
        message: 'Code invalide ou introuvable'
      });
    }

    // Retourner les infos (sans marquer comme utilisé encore)
    res.json({
      success: true,
      name: participation.name,
      reward: participation.reward_type,
      code: participation.reward_code,
      used: participation.reward_used,
      usedAt: participation.used_at
    });

  } catch (error) {
    console.error('❌ Erreur validation publique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ✅ Marquer un code comme utilisé (nécessite confirmation manuelle admin)
router.post('/:code/use', async (req, res) => {
  try {
    const { code } = req.params;
    const { adminConfirm } = req.body;

    // Sécurité: Nécessite une confirmation (à implémenter selon vos besoins)
    if (!adminConfirm) {
      return res.status(403).json({
        success: false,
        message: 'Confirmation requise'
      });
    }

    const { data, error } = await supabase
      .from('participations')
      .update({
        reward_used: true,
        used_at: new Date().toISOString()
      })
      .eq('reward_code', code)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Récompense marquée comme utilisée'
    });

  } catch (error) {
    console.error('❌ Erreur marquage utilisé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;
