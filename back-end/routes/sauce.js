// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
const sauceCtrl = require('../controllers/sauce');
const sauce = require('../models/sauce');
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');
// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();



router.post('/', auth, multer, sauceCtrl.createSauce);
// Renvoie la sauce avec l'ID fourni
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Renvoie le tableau de toutes les sauces dans la base de données
router.get('/', auth, sauceCtrl.getAllSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.createStatut);
// Définit le statut "j'aime" pour userID fourni. Si j'aime = 1,l'utilisateur aime la sauce. Si j'aime = 0,l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime =-1, l'utilisateur n'aime pas la sauce.L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, engardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce)




module.exports = router;