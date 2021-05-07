const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.authenticateUser = async (req, res, next) => {
    //Show msg Error 
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Search if the user is registered

    const { email,password } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        res.status(401).json({ msg: "User not found" });
        return next();
    }

    // Check the password and auth User
    if(bcrypt.compareSync(password, user.password)) {
        // Create 
        const token = jwt.sign({
            name: user.name,
            id: user._id
        }, process.env.SECRET_KEY, {
            expiresIn: '8h'
        } );

    res.json({token});

    } else {
        res.status(401).json({msg: "Invalid password"});
    }

}   

exports.authenticatedUser = async (req, res, next) => {
    res.json({user: req.user});
}
