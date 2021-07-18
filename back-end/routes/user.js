const express = require('express');
const userCtrl = require('../controllers/user');
const cheekPassword = require('../middleware/cheek_password');
const cheekEmail=require('../middleware/cheek_email');
// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();

// Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base dedonnées
router.post('/signup',cheekEmail ,cheekPassword, userCtrl.signup);
router.post('/login', userCtrl.login);



module.exports = router;