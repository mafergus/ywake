const functions = require('firebase-functions');
const admin = require('firebase-admin');
var moment = require('moment');
const cors = require('cors')
const express = require('express');

// Twilio Credentials
const accountSid = functions.config().account.sid;
const authToken = functions.config().account.token;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(cors({ origin: true }));
app.post('/createUser/', (req, res) => { doCreateUser(req, res) });
app.post('/addQuote/', (req, res) => { doAddQuote(req, res) });
app.post('/handleIncoming/', (req, res) => { doHandleIncoming(req, res) });
app.post('/logError/', (req, res) => { logError(req, res) });
// app.put('/:id', (req, res) => {//...});
// app.delete('/:id', (req, res) => {//...});

exports.api = functions.https.onRequest(app);

function logError(req, res) {
  console.log("GOT INCOMING req: ", req, " req.body: ", req.body);
  return null;
}

function doHandleIncoming(req, res) {
  console.log("GOT INCOMING req.body: ", req.body);
  // const jsonBody = JSON.parse(req.body);
  const message = req.body.Body;
  console.log("Got message: ", message);
  const twiml = new MessagingResponse();
  const sender = req.body.From;

  if (message.toLowerCase() === 'out') {
    return admin.database().ref('users')
    .orderByChild('phoneNumber')
    .equalTo(sender)
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        console.log("FOUND THE USER! snapshot.val(): ", snapshot.val());
        const user = snapshot.val();
        return Object.keys(user)[0];
      } else {
        throw new Error("No such user!");
      }
    })
    .then(userId => {
      console.log("Saying goodbye to id: ", userId, " number: ", sender);
      return admin.database().ref('users/' + userId + '/time').set(-1);
    })
    .then(() => {
      twiml.message('We\'re sorry to see you go! Sign up again any time at inspire.ywake.com');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
      return res;
    })
    .catch(err => {
      console.log("Oops! Something went wrong: ", err);
    });
  } else {
    twiml.message('Sorry, we didn\'t understand that');
  }

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

  return res;
}

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
      throw new Error("User exists!");
    })
    .then(() => {
      var newUserRef = admin.database().ref('users').push();

      return newUserRef.set({ 
        phoneNumber,
        time,
        nextQuote: 1,
      });
    })
    .then(() => admin.database().ref('users/count').once('value'))
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      throw new Error("Well that's extra strange");
    })
    .then(userCount => admin.database().ref('users/count').set(userCount+1))
    .then(result => res.send({ status: "success" }))
    .catch(err => res.send({ status: "error", error: err.toString() }));
  }

  return res.send("Generic error");
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
    + "Your daily inspiration. " 
    + getPostFooter()
}

function getFooter() {
  // will give either 0 or 1
  const randomNum = getRandomInt(2);
  return `Inspired? Reply "+1" to like a quote`;
}

function getPostFooter() {
  return "Opt out by replying OUT";
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

          const messagePromise = sendMessage(user.phoneNumber, getMessageBody(quote));
          const incrementCountPromise = incrementQuote(user.nextQuote);
          const incrementQuotePromise = admin.database().ref('users/' + userId + "/nextQuote").set(user.nextQuote+1);
          return Promise.all([messagePromise, incrementCountPromise, incrementQuotePromise]);
        }
        throw new Error("Couldn't get a quote!");
      })
      .catch(err => {
        console.log(err);
      });
    });

    return;
  })
  .catch(err => {
    console.log(err);
    return;
  });
});

function incrementQuote(quoteId) {
  return admin.database().ref('quotes/' + quoteId + '/sentCount').once('value')
  .then(snapshot => {
    if (snapshot.exists()) {
      return admin.database().ref('quotes/' + quoteId + '/sentCount').set(snapshot.val()+1);
    } else {
      return admin.database().ref('quotes/' + quoteId + '/sentCount').set(1);
    }
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

