// const SURVEY_ID = 1;
var surveyID;

Survey
    .StylesManager
    .applyTheme("modern");

function sendResults(sender) {
    let results = JSON.stringify(sender.data);
    console.log(results);
    $.ajax({
        type: 'POST',
        url: '/send',
        data: {
            "results": results
        },
        success: function (data) {
            console.log("data sent");
            console.log(data);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

function generateSurvey(title) {
    $.ajax({
        type: 'POST',
        url: '/surveyType',
        data: {
            "title": title
        },
        async: false
    });
    $.ajax({
        type: 'POST',
        url: '/surveys',
        data: {
            "title": title
        },
        success: function (data) {
            var surveyJson = data[0].title;
            var survey = new Survey.Model(surveyJson);
            survey.onComplete.add(sendResults);

            $("#container").Survey({ model: survey });
            mainTitle = surveyJson.title;
            jsonLooper(surveyJson);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

$("body").on("click", "#boje", function () {
    titles = [];
    generateSurvey("Boje");
    surveyID = "boje";
});
$("body").on("click", "#motor", function () {
    titles = [];
    generateSurvey("Motori");
    surveyID = "motor";
});
$("body").on("click", "#ubija", function () {
    titles = [];
    generateSurvey("Promaja");
    surveyID = "ubija";
});
$("body").on("click", "#zivot", function () {
    titles = [];
    generateSurvey("Ludnica");
    surveyID = "zivot";
});