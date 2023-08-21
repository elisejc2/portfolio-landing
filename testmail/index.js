const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

class Mail {
 constructor(replyTo, topic, message) {
   this.replyTo = replyTo;
   this.topic = topic;
   this.message = message;
 }

 setParams() {

   // Create sendEmail params 
   this.params = {
     Destination: { /* required */
       CcAddresses: [
         /* more items */
       ],
       ToAddresses: [
   //      'stoneb344@gmail.com',
         'elisejc2@gmail.com',
         /* more items */
       ]
     },
     Message: { /* required */
       Body: { /* required */
         Html: {
          Charset: "UTF-8",
          Data: this.message
         },
         Text: {
          Charset: "UTF-8",
          Data: "<span>text</span>"
         }
        },
        Subject: {
         Charset: 'UTF-8',
         Data: this.topic
        }
       },
     Source: 'submissions@ejc-portfolio.com', /* required */
     ReplyToAddresses: [
         this.replyTo,
  
     // 'EMAIL_ADDRESS',
       /* more items */
     ],
   };
  }


  sendEmail() {
    // Create the promise and SES service object
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(this.params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
    function(data) {
      console.log(data.MessageId);
     }).catch(
       function(err) {
         console.error(err, err.stack);
     });
  }

}

module.exports = Mail;
