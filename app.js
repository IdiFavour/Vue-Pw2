const express = require('express')

const app = express()

app.use(express.json())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://idifavour:Junebuzz123@cluster0.9zqd2.mongodb.net/test', (err, client) => {
    db = client.db('webstore')
})