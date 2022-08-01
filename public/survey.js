// const SURVEY_ID = 1;

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
    var surveyJson;
    $.ajax({
        type: 'POST',
        url: '/surveys',
        data: {
            "title": title
        },
        success: function (data) {
            console.log(data);
            console.log(JSON.stringify(data[0].title))

            var survey = new Survey.Model(data[0].title);
            survey.onComplete.add(sendResults);

            $("#container").Survey({ model: survey });

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
    generateSurvey("Boje");
});
$("body").on("click", "#motori", function () {
    generateSurvey("Motori");
    $("#container").Survey({ model: survey });
});
$("body").on("click", "#ubija", function () {
    generateSurvey("Promaja");
    $("#container").Survey({ model: survey });
});
$("body").on("click", "#ludnica", function () {
    generateSurvey("Ludnica");
    $("#container").Survey({ model: survey });
});