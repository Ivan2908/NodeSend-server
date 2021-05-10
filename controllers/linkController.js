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

//Obtain the link id
exports.obtainLink = async (req, res, next) => {
    const { url,name } = req.params;
    // Verife if exist the link
    const idLink = await Link.findOne({ url });
    if(!idLink) {
        res.status(404).json({msg: 'That link does not exist'});
        return next();
    }

    // If the link exists
    res.json({file: idLink.name});

    const { numDownload } = idLink;

    // If the downloads are equal then 1 - Delete the entry and delete the file
    if(numDownload === 1) {
        // Delete the file 
        req.file = name;

        // Delete the entry from DB
        await idLink.findOneAndRemove(req.params.url);
        next();
    } else {
        // If the downloads are > then 1 - subtract 1
        idLink.numDownload--;
        await idLink.save();
    }
}