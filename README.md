# TestBackend – API de gestion de transactions

Backend **Node.js** permettant la gestion des utilisateurs, de l’authentification et des transactions (création, consultation, transfert).

---

## Technologies utilisées

- **Node.js**
- **Express.js**
- **PostgreSQL** (recommandé, mais toute base relationnelle compatible peut être utilisée)
- **JWT** pour l’authentification
- **Middleware de protection des routes**

---

## Prérequis

Avant de commencer, assurez-vous d’avoir installé :

- **Node.js** (version récente recommandée)
-  Une base de données (**PostgreSQL conseillé**)
-  Un gestionnaire de paquets (`npm` ou `yarn`)

---

## Installation

1. Télécharger le projet (ZIP ou clone Git)
2. Extraire l’archive si nécessaire
3. Se placer dans le dossier du projet :

```bash
cd TestBackend
```

Installer les dépendances :

```bash 
npm install
```

## Lancement du serveur

À la racine du projet (/TestBackend) :

```bash 
npm run dev
```

Le serveur sera accessible par défaut à l’adresse :
```bash 
http://localhost:PORT/test
```


(PORT à définir dans le fichier .env.local au même niveau que .env, noter que le .env ici sert de template)



## Endpoints de l’API

Toutes les routes de l’API sont accessibles via le préfixe : `/test`


Certaines routes sont protégées par un **middleware d’authentification JWT** et nécessitent l’envoi d’un token valide dans le header :


---

## Authentification

Toutes les routes sensibles sont protégées par un middleware JWT (`authMiddleware`).

L’utilisateur doit être connecté et fournir un token valide dans l’en-tête :

```bash 
Authorization: Bearer <token>
```

**Base URL :** `/test/auth`

| Méthode | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Créer un nouveau compte utilisateur |
| POST | `/login` | Connexion utilisateur et génération d’un token JWT |

---

## Transactions

**Base URL :** `/test/transactions`  
Toutes les routes ci-dessous nécessitent une authentification.

| Méthode | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Créer une nouvelle transaction |
| GET | `/` | Récupérer toutes les transactions |
| GET | `/user/me` | Récupérer les transactions de l’utilisateur connecté |
| GET | `/user/:user_id` | Récupérer les transactions d’un utilisateur spécifique |
| GET | `/:id` | Obtenir les détails d’une transaction |
| POST | `/transfer/:id` | Effectuer un transfert depuis vers un compte dont on précisera l'id |

---

## Utilisateurs

**Base URL :** `/test/users`

| Méthode | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me` | Oui | Récupérer le profil de l’utilisateur connecté |
| GET | `/` | Non | Récupérer la liste de tous les utilisateurs |
| GET | `/:id` | Non | Récupérer un utilisateur par son ID |
| PUT | `/:id` | Non | Mettre à jour les informations d’un utilisateur |
| DELETE | `/:id` | Non | Supprimer un utilisateur |

---

## Organisation des routes

```js
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/transactions', transactionsRoutes);

app.use('/test', router);


