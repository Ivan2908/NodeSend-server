const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res,next) => {
    
    // Check errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Create object Link
    const { original_name } = req.body;

    const link = new Link();
    link.url = shortid.generate();
    link.name = shortid.generate();
    link.original_name = original_name;

    //If the user is authenticated
    if(req.user) {
        const { password, numDownload } = req.body

        if(numDownload) {
            link.numDownload = numDownload;
        }
        if(password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }

        // Add the author
        link.author = req.user.id;
    }

    // Storage on the BD
    try {
        await link.save();
        return res.json({ msg: `${link.url}` });
        next();
    } catch (error) {
        console.log(error);
    }
};