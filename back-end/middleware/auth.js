// On récupère le package jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
            // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split)
        const token = req.headers.authorization.split(' ')[1];
            // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'; // si le token ne correspond pas au userId : erreur
        } else {
            next(); // si tout est valide on passe au prochain middleware
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};