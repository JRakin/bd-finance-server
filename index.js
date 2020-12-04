const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

const uri = `mongodb+srv://juaid22:${process.env.DB_PASS}@cluster0.n7cap.mongodb.net/bdfinance?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const userCollection = client.db('bdfinance').collection('users');
  const adminCollection = client.db('bdfinance').collection('admins');

  app.post('/addUser', (req, res) => {
    // console.log(req.body);
    userCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/getUserByEmail/:email', (req, res) => {
    userCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get('/getUserById/:id', (req, res) => {
    userCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get('/getAllUser', (req, res) => {
    userCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post('/makeAdmin', (req, res) => {
    adminCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post('/isAdmin', (req, res) => {
    adminCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  console.log('connected');
});

app.get('/', (req, res) => {
  res.send('Hello from the other side');
});

app.listen(PORT, () => {
  console.log('Listening to the port...', PORT);
});
