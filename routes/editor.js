const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');


router.get('/', isLoggedIn, async (req, res) => {
    res.render('editor');
});

module.exports = router;