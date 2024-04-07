const router = require('express').Router();
const { askGpt } = require('../utils/askgpt');
router.post('', askGpt);
module.exports = router;