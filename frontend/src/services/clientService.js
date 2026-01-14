import axios from './api'; // Réutilise ton instance axios configurée

export const ClientService = {
  /**
   * Enregistre un nouveau bon client (participation)
   * @param {Object} data - { name, email, reward, code }
   */
  async saveClient(data) {
    try {
      const response = await axios.post('/api/clients/bon', data);
      return response.data;
    } catch (error) {
      console.error('Erreur saveClient:', error);
      throw error;
    }
  },

  /**
   * Récupère la liste complète des clients
   */
  async getAllClients() {
    try {
      const response = await axios.get('/api/clients/liste');
      return response.data.data;
    } catch (error) {
      console.error('Erreur getAllClients:', error);
      throw error;
    }
  }
};
