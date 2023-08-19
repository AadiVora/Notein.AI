const express = require('express');
const router = express.Router();
const {
    sentimentAnalysis,
    grammarChecker,
    imageToText,
} = require('../controllers/FeaturesController');
const authen = require('../middleware/Authen.js');

router.post('/sentiment', sentimentAnalysis);
// router.get('/grammar', authen, grammarChecker);
router.post('/image', authen, imageToText);

module.exports = router