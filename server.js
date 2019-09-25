require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const fs = require('fs');

app.use(express.static('public'));

const queryStringParams = {
    client_id : process.env.CLIENT_ID,
    redirect_uri : encodeURI('http://localhost:' + process.env.PORT),
    scope : 'user-top-read,playlist-modify-private,playlist-modify-private,playlist-modify-public',
    response_type : 'token',
    show_dialog : true
}

app.get('/authorize', function(req, res) {
    res.send('https://accounts.spotify.com/authorize?' + querystring.stringify(queryStringParams));
})

app.use(bodyParser.json());
app.post('/save', function(req, res) {
    let dir = './public/my.json';
    let toSave = JSON.stringify(req.body);

    res.send(fs.writeFile(dir, toSave, e => {
        if (e) console.log(e);
        //console.log(`file saved to ${dir}`);
    }));
})

var listener = app.listen(process.env.PORT, function () {
    console.log('mousiki is live on ' + listener.address().port);
})