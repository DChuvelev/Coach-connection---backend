const router = require('express').Router();
const gptRouter = require('./gpt');

router.use('/askGpt', gptRouter);

module.exports = router;