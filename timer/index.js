const express = require('express');
const router = express();

router.get('/', (req, res) => {
 res.sendFile(__dirname + '/timer.html')
})

router.get('/timercss.css', (req, res) => {
 res.sendFile(__dirname + '/timercss.css')
})

router.get('/indexTimer.js', (req, res) => {
 res.sendFile(__dirname + '/indexTimer.js')
})
router.get('/timer.js', (req, res) => {
 res.sendFile(__dirname + '/timer.js')
})


module.exports = router;
