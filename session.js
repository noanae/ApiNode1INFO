const express = require("express");
const session = require("express-session");require('dotenv').config();

const app = express();
const PORT = 3000;

// Midleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Midleware pour gérer les sessions
app.use(session({
    secret : 'secretKey', // Clé secrète pour signer les cookies de session
    resave : false,
    saveUninitialized : false,
}));

// Middleware d'authentification
const requireAuth = (req,res,next) => {
    if (req.session && req.session.user) {
        // si l'utilisateur est authentifié, continuez
        return next ();
    } else {
        // Sinon, renvoyer une erreur de non autorisé 
        return res.status(401).json({ error : 'Unauthorized'});
    }
};

// qlq users dans un tableau pour eviter de passer par une base données
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
  ];

// Route de connexion
app.post('/login', (req,res) => {
    const {username, password } = req.body;
    // Recherche de l'utilisateur dans la liste
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Authantification réussie, stocker l'utilisateur dans la session
        req.session.user = user;
        res.json({ message : 'login succesfull'});
    }else{
        res.status(401).send('Utilisateur non authentifié');
    }
});


// route protégée pour récupérer tout les users
app.get('/users', requireAuth, (req,res) => {
    res.json(users);
}); 

// route de deconnexion
app.post('/logout', (req,res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error'});
        } else {
            res.json({ message: 'Logout successful'});
        }
    });
});

// Démarer le serveur
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
