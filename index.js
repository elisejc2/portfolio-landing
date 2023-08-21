const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const Mail = require('./testmail/index.js')
const movieFightRouter = require('./Elise-Movie-Fight-Project/index.js')
const nutritionLabelRouter = require('./nutritionLabel/index.js')
const ecommerceRouter = require('./ecommerce/index.js')
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
 res.sendFile(__dirname + '/ec2portfolio/contactForm.js')
})
app.use('/ecommerce', ecommerceRouter)
app.use('/nutritionLabel', nutritionLabelRouter)
app.use('/movie-fight', movieFightRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//http://http://home.ejc-portfolio.com:3000/
