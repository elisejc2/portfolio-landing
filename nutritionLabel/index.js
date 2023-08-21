const express = require('express');
const router = express();

router.get('/', (req, res) => {
 res.sendFile(__dirname + '/nutrition.html')
})

router.get('/nutritionLabel/styles.css', (req, res) => {
 res.sendFile(__dirname + '/styles.css')
})

module.exports = router;
