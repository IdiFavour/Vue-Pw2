var http = require("http")
var express = require("express")

var app = express()

app.get('/', function(req, res) {
    res.send("Coursework Two")
})

app.get("/lessons", function(req, res) {
    let lessons = [{
            "topic": "Math",
            "location": "London",
            "price": 20
        },
        {
            "topic": "Math",
            "location": "Liverpool",
            "price": 60
        },
        {
            "topic": "Math",
            "location": "Oxford",
            "price": 90
        },
        {
            "topic": "Math",
            "location": "Bistrol",
            "price": 200
        }
    ]
    res.header("Access-Control-Allow-Origin", "*")
    res.send(lessons)
})

app.get("/users", function(req, res) {
    let users = {
        "email": "user@email.com",
        "password": "mypassword"
    }
    res.send(users)
})

app.listen(3000)