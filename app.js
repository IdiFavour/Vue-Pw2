const express = require('express')
var path = require("path")
var fs = require("fs")
var cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

// connect to MongoDB
const ObjectID = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://idifavour:Junebuzz123@cluster0.9zqd2.mongodb.net/test', (err, client) => {
    db = client.db('webstore')
})


// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})

// Logging middleware
app.use(function(req, res, next){
    console.log("Request type: "+req.method)
    console.log("Request url: "+req.url)
    console.log("Request date: "+new Date())
    console.log("Request IP: "+req.ip)
    next()
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})


//getting static images 
app.use(function(req, res, next){
    var filePath = path.join(__dirname, "static", req.url, "")
    fs.stat(filePath, function(err, fileInfo){
        if(err){
            next()
            return;
        }
        if(fileInfo.isFile()){
            res.sendFile(filePath)
        } else {
            next()
        }
    })
})

// Update lesson spaces
app.put('/collection/:collectionName', (req, res, next) => {
    req.body.forEach((item) => {
        let filter = { _id: new ObjectID(item.id) }
        let new_value = { $set: {stock: item.stock} }
        let options = { safe: true, multi: false }
        req.collection.updateOne(filter, new_value, options, (err, result) => {
            if (err) return next(err)
        })
    });
    res.send({msg: "spaces successfully updated"})
})


// Add new order
app.post("/collection/:collectionName", (req, res, next) => {
    let doc = req.body
    req.collection.insertOne(doc, (err, result) => {
        if (err) return next(err)
        res.send({msg: "order added successfully"})
    })
})


app.get('/collection/:collectionName/search', (req, res) => {
    let search_keyword = req.query.filter
    req.collection.find({}).toArray((err, results) => {
        if (err) return next(err)
        let filteredList = results.filter((lesson) => {
            return lesson.subject.toLowerCase().match(search_keyword.toLowerCase()) || lesson.location.toLowerCase().match(search_keyword.toLowerCase())
        });  
        res.send(filteredList)
    })
})


app.use(function(req, res){
    res.status(404)
    res.send("File not found")
})




const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Express.js server running at localhost:3000")
})
