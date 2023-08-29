const express = require('express'); //comment
const router = express();

router.get('/', (req, res) => {
 res.sendFile(__dirname + '/movieFightProject.html')
})

router.get('/movieFightProject.css', (req, res) => {
 res.sendFile(__dirname + '/movieFightProject.css')
})

router.get('/movieFightProject.js', (req, res) => {
 res.sendFile(__dirname + '/movieFightProject.js')
})

router.get('/utilityMovieFightProject.js', (req, res) => {
 res.sendFile(__dirname + '/utilityMovieFightProject.js')
})

router.get('/autocompleteMFP.js', (req, res) => {
 res.sendFile(__dirname + '/autocompleteMFP.js')
})

module.exports = router;
