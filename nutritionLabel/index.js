const express = require('express');
const router = express();

router.get('/', (req, res) => {
 res.sendFile(__dirname + '/nutrition.html')
})

router.get('/nutritionLabel.css', (req, res) => {
 res.sendFile(__dirname + '/nutritionLabel.css')
})

module.exports = router;
