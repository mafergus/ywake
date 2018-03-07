const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Twilio Credentials
const accountSid = 'ACa2c223eafd99f3f430296ea346ea63ec';
const authToken = '4670e436d6461e314cfe2e38102940f7';
// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

var moment = require('moment');

function sendMessage(to, body) {
  return client.messages
  .create({
    to,
    from: '+18316100384',
    body,
  })
  .then(message => console.log(message))
  .catch(err => console.log(err));
}

function getMessageBody(quote) {
  return quote.text + " - " + quote.author + "\n\n" 
    + "Your daily inspiration from Ywake. Find more inspiration at www.ywake.com";
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  return client.messages
  .create({
    to: '+16507961513',
    from: '+18316100384',
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  })
  .then(message => console.log(message))
  .catch(err => console.log(err));
});

exports.hourly_job = functions.pubsub.topic('hourly-tick').onPublish((event) => {
  var now = moment().utc();
  var roundDown = now.startOf('hour');
  console.log("Time now() ", roundDown.hour());

  return admin.database().ref('users')
  .orderByChild("time")
  .equalTo(roundDown.hour())
  .once("value")
  .then(snapshot => {
    snapshot.forEach(userData => {
      const userId = userData.key;
      const user = userData.val();

      admin.database().ref('quotes/' + user.nextQuote)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() !== null) {
          const quote = snapshot.val();
          console.log("Quote: ", quote);

          sendMessage(user.phoneNumber, getMessageBody(quote));
          return admin.database().ref('users/' + userId + "/nextQuote").set(user.nextQuote+1);
        }
        return "Couldn't get a quote!";
      })
      .catch(err => {
        console.log(err);
      });
    });

    return
  })
  .catch(err => {
    console.log(err);
    return;
  });

  // return admin.database().ref('users/' + userId).once('value')
  //   .then(userData => { 
  //     console.log("userData: ", userData.val());
  //     if (!userData.exists()) {
  //       const userObject = {
  //         displayName: getDisplayName(),
  //         highScore: 0,
  //       };
  //       return admin.database().ref('users/' + userId).set(userObject);
  //     }
  //     return null;
  //   })
  //   .catch(err => console.log(err));
});
