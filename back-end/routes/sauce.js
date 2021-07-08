const express = require('express');
const sauceCtrl = require('../controllers/sauce');
const sauce = require('../models/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();



router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.createStatut);