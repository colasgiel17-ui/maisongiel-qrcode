#!/bin/bash

# Script pour reset les données de développement

echo "🔄 Reset des données de développement..."

# Arrêter le backend si lancé
echo "⏸️  Arrêt du backend..."
pkill -f "node.*server.js" 2>/dev/null || true

# Supprimer la base de données
echo "🗑️  Suppression de la base de données..."
rm -f backend/database.sqlite
rm -f backend/database.sqlite.*

# Vider le dossier uploads (sauf le .gitkeep)
echo "🗑️  Nettoyage des uploads..."
rm -f backend/uploads/*.jpg backend/uploads/*.jpeg backend/uploads/*.png backend/uploads/*.gif 2>/dev/null || true

# Vider les logs
echo "🗑️  Nettoyage des logs..."
rm -f backend/logs/*.log 2>/dev/null || true

echo "✅ Reset terminé !"
echo ""
echo "Pour relancer l'application :"
echo "  npm run dev"
