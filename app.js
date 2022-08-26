const express = require("express");
const app = express();
const db = require('./database');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("server is listening on port 3000");
});

app.use('/', express.static('public'));

app.post('/results', db.getResults);
app.post('/surveyType', db.getSurveyTypes);
app.post('/surveys', db.getSurveys);
app.post('/surveyNames', db.getQuestionNames);
app.post('/getUser', db.getUser);
app.post('/getAuthorization', db.getAuthorization);
app.post('/titles', db.getSurveyTitles);
app.post('/getRouter', db.getRouter);
app.post('/getRouterType', db.getRouterType);