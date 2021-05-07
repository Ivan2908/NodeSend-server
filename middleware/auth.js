const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(authHeader) {
        // Obtain the token 
        const token = authHeader.split(' ')[1];

        // check the JWT
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            req.user = user;
        } catch (error) {
            console.log(error);
            res.status(401).json({msg: "Invalid Token"});
        }
    }
    return next();
}