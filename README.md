# Projet Tokenizer - 🪙 Créez votre propre jeton

## 📋 Résumé

Jeton numérique unique ERC-20, le CryptoZombie42, sur le réseau Goerli Ethereum.

Le jeton FTCZ42, sert de monnaie virtuelle au sein d'un jeu, permettant aux joueurs d'acheter des améliorations pour leurs zombies, de changer leurs noms ou d'ajuster leurs codes ADN. Le jeton est également utilisé pour proposer et voter des ameliorations au jeu.
Ce projet vise à créer un petit jeu de type CryptoZombies, dans lequel les joueurs peuvent créer des zombies non fongibles (NFT) et les améliorer en utilisant le token ERC-20.

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
- Avoir un compte sur le reseau goerli
- Avoir quelques GoerliEth (minable via https://goerli-faucet.pk910.de/)
- Avoir installer foundry
  https://book.getfoundry.sh/getting-started/installation

  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```

## 📦 Installation

Pour commencer avec ce projet, suivez les étapes ci-dessous :  
Ajouter l'extension Metamask a votre navigateur

```bash
git clone https://github.com/Jeanmichel7/42_tokenizer.git
cd 42_tokenizer
#ouvrir .env et ajuster les variables tels que votre cle privee, etc...
cd deployment
chmod 700 deploy*
./deploy.sh
```

Le script va appeler les scripts de deployment dans l'ordre, il va deployer le contract du token ERC20, puis le contract du jeu cryptoZombie, et lancer l'app web
Vous pouvez donc deployer le smat contract du jeu et du token independemment, et si besoin mettre a jour l'address du token sur le contract du jeu via la fonction setToken42Address(address \_token42Address).

## 🛠️ Utilisation

Après l'installation, naviguer a l'url http://localhost:5173/  
Vous pouvez tester les fonctions sur https://goerli.etherscan.io/  
Token https://goerli.etherscan.io/address/0x61E9Ed6AF44c1115f4A03b3F34bb13dDB88232eB  
Game https://goerli.etherscan.io/address/0xB4b2C80315CEce1e0A1600f30B6A082e2E5C096B

## 🌟 Bonus

Mise en place d'un systeme de multisignature pour transferer les fonds du contract (token ERC20 et Ethereum) vers un autre wallet.

## 📄 Documentation

Veuillez consulter le dossier "documentation" à la racine de votre dépôt pour une explication détaillée du fonctionnement de votre token et des éléments nécessaires pour son utilisation.
