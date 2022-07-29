// const SURVEY_ID = 1;

Survey
    .StylesManager
    .applyTheme("modern");

const surveyJson = {
    "title": "Anketa",
    "logoPosition": "right",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "checkbox",
                    "name": "polozeno",
                    "title": "Koje predmete ste položili?",
                    "choices": [
                        "Baze podataka",
                        "Web programiranje",
                        "C#",
                        "Java",
                        "Mikroračunala"
                    ]
                },
                {
                    "type": "dropdown",
                    "name": "najdrazi",
                    "title": "Odaberite najdraži predmet",
                    "choices": [
                        "Baze podataka",
                        "Web programiranje",
                        "C#",
                        "Java",
                        "Mikroračunala"
                    ]
                },
                {
                    "type": "rating",
                    "name": "zadovoljni",
                    "title": "Koliko ste zadovoljni svojim uspjehom?"
                },
                {
                    "type": "radiogroup",
                    "name": "nebo",
                    "title": "Je li nebo plave boje",
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "red",
                            "text": "da"
                        },
                        {
                            "value": "blue",
                            "text": "ne"
                        }
                    ]
                }
            ]
        }
    ]
}

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

$("body").on("click", "#survey", function () {
    survey.clear();
    $("#container").Survey({ model: survey });
});