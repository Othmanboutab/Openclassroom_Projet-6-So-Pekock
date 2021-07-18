const sauce = require('../models/sauce');

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');


// fonction pour creer une nouvelle sauce
exports.createSauce = (req, res, next) => {
      // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
    const sauceObject = JSON.parse(req.body.thing);
    // supprimer l'id generer automatically
    delete thingObject._id;

      // Création d'une instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
      // Sauvegarde de la sauce dans la base de données
    Sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};


// recuperer la sauce avec le bon ID 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};


// recuperer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};



exports.modifySauce = (req, res, next) => {

    const thingObject = req.file ? {
            // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


//supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.createStatut = (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Permet de "liker"ou "dislaker" une sauce
exports.likeDislikeSauce = (req, res, next) => {

    // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
    let like = req.body.like
      // le userID
    let userId = req.body.userId
      // l'id de la sauce
    let sauceId = req.params.id
    
    switch (like) {
      case 1 :
          Sauce.updateOne({ _id: sauceId }, 
                    // On push l'utilisateur et on incrémente le compteur de 1
            { $push: { usersLiked: userId }, 
            // On incrémente de 1
            $inc: { likes: +1 }})
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))
              
        break;
  
      case 0 :
          Sauce.findOne({ _id: sauceId })
             .then((sauce) => {
              if (sauce.usersLiked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
              if (sauce.usersDisliked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId },
                    // On incrémente de -1
                     $inc: { dislikes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
            })
            .catch((error) => res.status(404).json({ error }))
        break;
  
      case -1 :
          Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
            .catch((error) => res.status(400).json({ error }))
        break;
        
        default:
          console.log(error);
    }
  }