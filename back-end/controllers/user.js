const user = require('../models/user');

// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require('jsonwebtoken');
// l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt');


//crée un nouvel utilisateur
exports.signup = (req, res, next) => {
    // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
    bcrypt.hash(req.body.password, 10)
      // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
      .then(hash => {
        // Création du nouvel utilisateur avec le model mongoose
        const user = new User({
          // On passe l'email qu'on trouve dans le corps de la requête
          email: req.body.email,
          // On récupère le mdp hashé de bcrypt
          password: hash
        });
        // On enregistre l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({
            message: 'Utilisateur créé !'
          }))
          .catch(error => res.status(400).json({
            error
          })); // Si il existe déjà un utilisateur avec cette adresse email
      })
      .catch(error => res.status(500).json({
        error
      }));
  
  };








// connextion de l'utilisateur 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                      // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
                  // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                              // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                              // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET',  // Clé d'encodage du token 
                                          // Argument de configuration avec une expiration au bout de 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};