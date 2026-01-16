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

// ✅ Marquer un code comme utilisé (accessible publiquement pour commerçant)
router.post('/:code/use', async (req, res) => {
  try {
    const { code } = req.params

    console.log('✅ Validation définitive du code:', code)

    // Chercher la participation
    const { data: participation, error: fetchError } = await supabase
      .from('participations')
      .select('*')
      .eq('reward_code', code)
      .single()

    if (fetchError || !participation) {
      return res.status(404).json({
        success: false,
        message: 'Code introuvable'
      })
    }

    // Vérifier si déjà utilisé
    if (participation.reward_used === true) {
      return res.status(400).json({
        success: false,
        message: 'Cette récompense a déjà été utilisée le ' + new Date(participation.used_at).toLocaleString('fr-FR')
      })
    }

    // Marquer comme utilisé
    const { error: updateError } = await supabase
      .from('participations')
      .update({
        reward_used: true,
        used_at: new Date().toISOString()
      })
      .eq('reward_code', code)

    if (updateError) throw updateError

    console.log('✅ Récompense validée:', code, 'à', new Date().toISOString())

    res.json({
      success: true,
      message: 'Récompense validée avec succès',
      validatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erreur validation:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
})

module.exports = router
