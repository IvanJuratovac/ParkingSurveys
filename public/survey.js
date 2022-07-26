// const SURVEY_ID = 1;

Survey
    .StylesManager
    .applyTheme("modern");

const surveyJson = {
    "title": "Najbolja anketa",
    "description": "Najbolji opis ankete nalazi se ovdje.",
    "logoPosition": "right",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "text",
                    "name": "ime",
                    "title": "Kako vas zovu?",
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "boja",
                    "title": "Koja ti je omiljena boja?",
                    "isRequired": true,
                    "choices": [
                        "crvena",
                        "plava",
                        "zelena"
                    ]
                },
                {
                    "type": "rating",
                    "name": "ocjena",
                    "title": "Ocijenite ovu anketu",
                    "isRequired": true
                }
            ]
        }
    ],
    "triggers": [
        {
            "type": "setvalue",
            "expression": "{ime} empty",
            "setToName": "ime"
        }
    ]
};

const survey = new Survey.Model(surveyJson);

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

survey.onComplete.add(sendResults);

$(function () {
    $("#surveyContainer").Survey({ model: survey });
});

// function saveSurveyResults(url, json) {
//     const request = new XMLHttpRequest();
//     request.open('POST', url);
//     request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//     request.addEventListener('load', () => {
//         // Handle "load"
//     });
//     request.addEventListener('error', () => {
//         // Handle "error"
//     });
//     request.send(JSON.stringify(json));
// }