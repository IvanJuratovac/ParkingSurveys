const express = require("express");
const app = express();
const db = require('./database');
const bodyParser = require("body-parser");
const auth = require('./auth');
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

router.post('/login', auth.makeToken);
router.get('/token', auth.authenticateToken);

app.use('/api', router);
app.listen(3000, () => {
    console.log("server is listening on port 3000");
});
