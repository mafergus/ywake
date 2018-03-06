const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
  // Twilio Credentials
  const accountSid = 'ACa2c223eafd99f3f430296ea346ea63ec';
  const authToken = '4670e436d6461e314cfe2e38102940f7';

  // require the Twilio module and create a REST client
  const client = require('twilio')(accountSid, authToken);

  return client.messages
  .create({
    to: '+16507961513',
    from: '+18316100384',
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  })
  .then(message => console.log(message.sid));
});
