const express = require("express");
const app = express();
const db = require('./database');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

var router = express.Router();

router.use('/', express.static('public'));

router.post('/results', db.getResults);
router.post('/surveyType', db.getSurveyTypes);
router.post('/surveys', db.getSurveys);
router.post('/surveyNames', db.getQuestionNames);
router.post('/getUser', db.getUser);
router.post('/hashingFunction', db.hashingF);
router.post('/getAuthorization', db.getAuthorization);
router.post('/titles', db.getSurveyTitles);
router.post('/getRouter', db.getRouter);
router.post('/getRouterType', db.getRouterType);
router.post('/send', db.insertResults);

router.post('/login', (req, res) => {
    const IDuser = { IDuser: req.body.IDuser }
    const accessToken = jwt.sign(IDuser, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

router.get('/token', authenticateToken);

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

app.use('/api', router);
app.listen(3000, () => {
    console.log("server is listening on port 3000");
});
