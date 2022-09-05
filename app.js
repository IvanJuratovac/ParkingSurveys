const express = require("express");
const app = express();
const db = require('./database');
const bodyParser = require("body-parser");
const auth = require('./auth');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));
app.use(express.json());

var router = express.Router();

router.use('/', express.static('public'));

router.get('/users', db.getUser);
router.get('/hashing', db.hashingF);
router.get('/results', db.getResults);
router.get('/authorization', db.getAuthorization);
router.get('/token', auth.authenticateToken);

router.get('/surveys', db.getSurveys);
router.get('/surveys/names', db.getSurveyNames);
router.get('/surveys/types', db.getSurveyTypes);
router.get('/surveys/titles', db.getSurveyTitles);

router.get('/router', db.getRouter);
router.get('/router/type', db.getRouterType);

router.post('/send', db.insertResults);
router.post('/login', auth.makeToken);

app.use('/api', router);
app.listen(3000, () => {
    console.log("server is listening on port 3000");
});
