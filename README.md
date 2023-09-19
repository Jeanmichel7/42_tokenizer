# Projet Tokenizer - 🪙 Créez votre propre jeton

## 📋 Résumé

Projet au carrefour de la technologie blockchain et du gaming, né d'une collaboration entre 42 et Binance, j'ai donc tout naturellement choisi la chaine ETH. Dans ce projet, j'ai créer un jeton numérique unique ERC-20, le CryptoZombie42.

Mon jeton, qui s'inscrit dans une dynamique d'échange à un taux de 1000 pour 1 ETH, sert de monnaie virtuelle au sein du jeu, permettant aux joueurs d'acheter des améliorations pour leurs zombies, de changer leurs noms ou d'ajuster leurs codes ADN. Ce projet vise à établir une économie virtuelle prospère (surtout pour le proprietaire) qui faciliterait les transactions dans l'écosystème du jeu, enrichissant ainsi l'expérience de jeu.

Dans le cadre de ce projet, j'ai également développé une application React qui sert de plateforme pour tester et interagir avec les diverses fonctionnalités du jeton.

## 💻 Technologies Utilisées

- Reseau Goerli - Ethereum testnet
- Foundry (Development Frameworks) - Forge
- Solidity 0.8.13
- Metamask
- OpenZeppelin contracts template
- CryptoZombies contrats lessons
- App React with ethers.js

## 📦 Prerequis

- Avoir l'extension Metamask
- Avoir un account sur le reseau goerli
- Avoir quelques GoerliEth (minable via https://goerli-faucet.pk910.de/)
- Avoir installer foundry
  ```bash
  npm install foundry ou forge jsais plus
  ```

## 📦 Installation

Pour commencer avec ce projet, suivez les étapes ci-dessous :  
Ajouter l'extension Metamask a votre navigateur

```bash
git clone https://github.com/Jeanmichel7/42_tokenizer.git
cd 42_tokenizer
#open .env and modify data like PRIVATE_KEY to deploy contracts
cd deployment
chmod 700 deploy*
./deploy.sh
```

Ca va deployer le contract du token ERC20, puis le contract du jeu cryptoZombie, et lancer l'app web  
Vous pouvez egalement deployer le smat contract du jeu et du token independemment.

## 🛠️ Utilisation

Après l'installation, suivez les instructions contenues dans la documentation du projet.  
Vous pouvez tester les fonctions sur https://goerli.etherscan.io/  
Token: https://goerli.etherscan.io/address/0xD6C5fE36882feD463f2F9b95E230be31d5fD59DD  
Game: https://goerli.etherscan.io/address/0xC2A381f16bBf74b9bD7804ff8CF98010E188e80E

## 🌟 Bonus

Envisagez de mettre en place un système multisignature pour augmenter la sécurité de votre token et prévenir les activités frauduleuses.

## 📄 Documentation

Veuillez consulter le dossier "documentation" à la racine de votre dépôt pour une explication détaillée du fonctionnement de votre token et des éléments nécessaires pour son utilisation.
