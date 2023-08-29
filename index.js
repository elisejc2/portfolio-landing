const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const Mail = require('./testmail/index.js')
const movieFightRouter = require('./Elise-Movie-Fight-Project/index.js')
const nutritionLabelRouter = require('./nutritionLabel/index.js')
const ecommerceRouter = require('./ecommerce/index.js')
const surveyFormRouter = require('./survey-form/index.js')
const quizRouter = require('./quiz/index.js')
const Timer = require('./timer/timer.js')
const timerRouter = require('./timer/index.js')
const jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(jsonParser);

app.post('/notify', (req, res) => {
  console.log("inside API", req.body)
  const { name, business, topic, email, message } = req.body;
  const formattedMessage = `Name: ${name} \nCompany: ${business} \n\nMessage: ${message}`
  const mailSender = new Mail(email, topic, formattedMessage)
  mailSender.setParams()
  mailSender.sendEmail()

  res.send('Message Sent!')
})

app.use(express.static('public'))
app.get('/', (req, res) => {
 res.sendFile(__dirname + '/public/contactForm.js')
})

app.get('/', (req, res) => {
 res.sendFile(__dirname + '/public/timerButton.js')
})

/* app.post('/Timer', (req, res) => {
const { durationInput, startButton, pauseButton, callbacks  } = req.body;
const timerButton = new Timer (durationInput, startButton, pauseButton, callbacks)
console.log(`timerButton: ${timerButton}`)
res.send(timerButton)
}) */
app.use('/ecommerce', ecommerceRouter)
app.use('/nutritionLabel', nutritionLabelRouter)
app.use('/movie-fight', movieFightRouter)
app.use('/survey-form', surveyFormRouter)
app.use('/quiz', quizRouter)
app.use('/timer', timerRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//http://http://home.ejc-portfolio.com:3000/
