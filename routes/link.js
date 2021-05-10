const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const filesController = require('../controllers/filesController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('name', 'Upload file').not().isEmpty(),
        check('original_name', 'Upload file').not().isEmpty(),
    ],
    auth,
    linkController.newLink
);

router.get('/:url',
    linkController.obtainLink,
    filesController.deleteFile
);

module.exports = router;