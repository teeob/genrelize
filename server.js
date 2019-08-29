require('dotenv').config()

const express = require('express');
const app = express();

const client_id = process.env.CLIENT_ID;
const response_type = 'token';
const redirect_uri = 'http://localhost:' + process.env.PORT;
const scope = 'user-top-read';   
const show_dialog = true;

app.use(express.static('public'));

app.get('/', function (req, res){
    res.send('Hello Tare');
})

app.get('/login', function(req, res) {

    const url = 'https://accounts.spotify.com/authorize?client_id=' + client_id
    +'&redirect_uri=' + encodeURIComponent(redirect_uri)
    +'&scope=' + encodeURIComponent(scope)
    +'&response_type=' + response_type
    +'&show_dialog=' + show_dialog;
    
    res.send(url);
})

var listener = app.listen(process.env.PORT, function () {
    console.log('mousiki is live on ' + listener.address().port);
})