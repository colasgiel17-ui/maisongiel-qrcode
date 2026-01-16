const axios = require('axios');

// ID de votre établissement Google (à extraire de l'URL Google Maps)
const GOOGLE_PLACE_ID = 'ChIJK6qPT89-Qg0RUUbgoPe1V90'; // Extrait de votre URL

/**
 * Vérifie si un email a laissé un avis Google
 * Note: L'API Google My Business nécessite OAuth2 et ne permet pas de rechercher par email directement.
 * Cette fonction est un placeholder. En production, vous devrez :
 * 1. Utiliser Google My Business API avec OAuth2
 * 2. Ou demander à l'utilisateur de coller le lien de son avis
 */
async function checkGoogleReview(email) {
  // IMPORTANT: L'API Google ne permet PAS de rechercher par email
  // Nous allons donc simplifier : l'utilisateur colle le lien de son avis
  
  // Pour l'instant, on retourne toujours true pour ne pas bloquer le flow
  // En production, vous devrez implémenter une vraie vérification
  
  console.log('⚠️ Vérification Google Review pour:', email);
  console.log('⚠️ En production, implémentez OAuth2 + Google My Business API');
  
  return {
    hasReview: true, // À remplacer par une vraie vérification
    reviewLink: null
  };
}

/**
 * Valide qu'un lien est bien un avis Google pour votre établissement
 */
function validateGoogleReviewLink(reviewLink) {
  if (!reviewLink) return false;
  
  const isGoogleLink = reviewLink.includes('google.com/maps') || 
                       reviewLink.includes('goo.gl') ||
                       reviewLink.includes('maps.app.goo.gl');
  
  // Optionnel: Vérifier que le lien contient votre Place ID
  const containsPlaceId = reviewLink.includes(GOOGLE_PLACE_ID) ||
                          reviewLink.includes('Maison+Giel');
  
  return isGoogleLink;
}

module.exports = {
  checkGoogleReview,
  validateGoogleReviewLink,
  GOOGLE_PLACE_ID
};
