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
app.post('/send', db.insertResults);

app.post('/surveyType',db.getSurveyTypes);
app.post('/surveys',db.getSurveys);
app.post('/surveyNames',db.getQuestionNames);
app.post('/deleteSurvey',db.deleteSurvey);
app.post('/updateSurvey',db.updateSurvey);

app.get('/titles',db.getSurveyTitles);


