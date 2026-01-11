#!/bin/bash

echo "🚀 Initialisation du projet Maison Giel - QR Code Reviews"
echo "=========================================================="
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé."
    echo "📥 Téléchargez-le sur : https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js détecté : $(node --version)"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
echo "-----------------------------------"

echo "⏳ Installation frontend..."
cd frontend && npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend installé"
else
    echo "❌ Erreur lors de l'installation du frontend"
    exit 1
fi

echo ""
echo "⏳ Installation backend..."
cd ../backend && npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend installé"
else
    echo "❌ Erreur lors de l'installation du backend"
    exit 1
fi

# Créer le dossier uploads
echo ""
echo "📁 Création du dossier uploads..."
mkdir -p uploads
echo "✅ Dossier uploads créé"

# Vérifier le fichier .env
echo ""
if [ -f ".env" ]; then
    echo "✅ Fichier .env trouvé"
else
    echo "⚠️  Fichier .env non trouvé"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé depuis .env.example"
        echo "⚠️  IMPORTANT: Modifiez le fichier .env avec vos propres valeurs!"
    fi
fi

cd ..

echo ""
echo "=========================================================="
echo "🎉 Installation terminée avec succès !"
echo "=========================================================="
echo ""
echo "📖 Prochaines étapes :"
echo "  1. Vérifiez backend/.env et changez les valeurs sensibles"
echo "  2. Lancez l'application avec : npm run dev"
echo "  3. Ouvrez http://localhost:5173 dans votre navigateur"
echo ""
echo "📚 Pour plus d'informations, consultez DEMARRAGE.md"
echo ""
