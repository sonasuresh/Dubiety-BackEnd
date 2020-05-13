const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors());

const PORT = process.env.PORT || 3000;


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));



//mongo ds061620.mlab.com:61620/heroku_qv8dpf91 -u sona -p sona123

const dbdetails = {
    username: "sona",
    password: "sona123",
    database: "heroku_qv8dpf91",
    host: "ds061620.mlab.com",
    port: "61620",
}

//const URL = 'mongodb://127.0.0.1:27017/stack';
const URL = 'mongodb://' + dbdetails.username + ':' + dbdetails.password + '@' + dbdetails.host + ':' + dbdetails.port + '/' + dbdetails.database;

mongoose.connect(URL, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Error while Connecting!')
    } else {
        console.log('Connected to Mongo DB')
    }
})


const UserRoute = require('./routes/userRoute');
app.use('/user', UserRoute);

const PostRoute = require('./routes/postRoute');
app.use('/post', PostRoute);

app.get('/', function (req, res) {
    res.send("Welcome to Dubiety Portal!")
})


app.listen(PORT, () => {
    console.log('Server Started on PORT ' + PORT)
})

