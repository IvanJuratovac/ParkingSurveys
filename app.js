const express = require("express");
const app = express();
const db = require('./database');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => {
    console.log("server is listening on port 3000");
});

app.use('/', express.static('public'));

app.post('/results', db.getResults);
app.post('/surveyType', db.getSurveyTypes);
app.post('/surveys', db.getSurveys);
app.post('/surveyNames', db.getQuestionNames);
app.post('/getUser', db.getUser);
app.post('/hashingFunction', db.hashingF);
app.post('/getAuthorization', db.getAuthorization);
app.post('/titles', db.getSurveyTitles);
app.post('/getRouter', db.getRouter);
app.post('/getRouterType', db.getRouterType);
app.post('/send', db.insertResults);

app.post('/login', (req, res) => {
    const IDuser = { IDuser: req.body.IDuser }
    const accessToken = jwt.sign(IDuser, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

app.get('/token', authenticateToken);

function authenticateToken(req, res) {
    console.log("/token");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        console.log("token null");
        res.status(401).send("Token je prazan");
    }
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, IDuser) => {
            if (err) {
                console.log("token verification error");
                res.status(403).send("Pogrešan token");
            }
            else {
                res.status(200).json(IDuser);
            }
        });
    }
}
