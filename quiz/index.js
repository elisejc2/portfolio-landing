const express = require('express');
const router = express();

router.get('/', (req, res) => {
 res.sendFile(__dirname + '/quiz.html')
})

router.get('/quiz.css', (req, res) => {
 res.sendFile(__dirname + '/quiz.css')
})

module.exports = router;
