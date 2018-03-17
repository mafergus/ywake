const functions = require('firebase-functions');
const admin = require('firebase-admin');
var moment = require('moment');
const cors = require('cors')
const express = require('express');

// Twilio Credentials
const accountSid = 'ACa2c223eafd99f3f430296ea346ea63ec';
const authToken = '4670e436d6461e314cfe2e38102940f7';
const client = require('twilio')(accountSid, authToken);

admin.initializeApp(functions.config().firebase);

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
// app.get('/news', (req, res) => {//...});
app.post('/createUser/', (req, res) => { doCreateUser(req, res) });
app.post('/addQuote/', (req, res) => { doAddQuote(req, res) });
// app.put('/:id', (req, res) => {//...});
// app.delete('/:id', (req, res) => {//...});

exports.api = functions.https.onRequest(app);

function doAddQuote(req, res) {
  console.log("req.body: ", req.body)
  const jsonBody = JSON.parse(req.body);

  if (jsonBody.hasOwnProperty("author") && jsonBody.hasOwnProperty("text")) {
    const { author, text } = jsonBody;

    return admin.database().ref('quotes/count').once('value').then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      throw new Error("Well that's extra strange");
    })
    .then(quoteCount => {
      console.log("Quote count before: ", quoteCount);
      const newQuoteCount = quoteCount+1;
      const countPromise = admin.database().ref('quotes/count').set(newQuoteCount);
      const quotePromise = admin.database().ref('quotes/' + newQuoteCount).set({
        author,
        text: `"${text}"`
      });
      return Promise.all([countPromise, quotePromise]);
    })
    .then(() => {
      return res.send({ status: "Success!" });
    })
    .catch(err => res.send({ status: err }));
  }

  return res.send({ status: "Vague Error" });
}

function doCreateUser(req, res) {
  console.log("req.body: ", req.body)
  const jsonBody = JSON.parse(req.body);

  if (jsonBody.hasOwnProperty("phoneNumber") && jsonBody.hasOwnProperty("time")) {
    const phoneNumber = jsonBody.phoneNumber;
    const time = jsonBody.time;

    return admin.database().ref('users')
    .orderByChild('phoneNumber')
    .equalTo(phoneNumber)
    .once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        return;
      }
      throw new Error("user exists");
    })
    .then(() => {
      var newUserRef = admin.database().ref('users').push();

      return newUserRef.set({ 
        phoneNumber,
        time,
        nextQuote: 1,
      });
    })
    .then(result => res.send({ status: "Success!" }))
    .catch(err => res.send({ status: "Uh oh! There was an error! ", err }));
  }

  return res.send("Uh oh! Error");

  // console.log("phoneNumber: " + req.body.phoneNumber + " time: " + req.body.time);

}

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
    + "Your daily inspiration from Ywake. Find more inspiration at www.ywake.com. Opt out by replying OUT";
}

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
});
