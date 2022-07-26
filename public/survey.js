// const SURVEY_ID = 1;

Survey
    .StylesManager
    .applyTheme("modern");

const surveyJson = {

    "title": "Anketa za pametne osobe",
    "description": "Ovdje je anketa",
    "logoPosition": "right",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "text",
                    "name": "postojanje",
                    "title": "Zašto postojimo?",
                    "isRequired": true
                },
                {
                    "type": "checkbox",
                    "name": "predmeti",
                    "title": "Koje predmete ste položili?",
                    "isRequired": true,
                    "choices": [
                        "Web programiranje 2",
                        "Java",
                        "C#",
                        "Mikroračunala"
                    ]
                },
                {
                    "type": "text",
                    "name": "dan",
                    "title": "Koji je današnji dan?",
                    "isRequired": true
                }
            ]
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