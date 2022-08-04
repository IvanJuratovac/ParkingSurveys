$.ajax({
    type: 'GET',
    url: '/titles',
    success: function (data) {
        $("#buttonContainer").html("");
        $.each(data, function (key, value) {
            $("#buttonContainer").append('<button class="button-34 anketa" id="' + value.id + '" role="button" onclick="generateSurvey(\'' + value.id + '\')">' + value.title + '</button>');
        });
    },
    error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
    },
    async: false
});

var surveyID;
var surveyJson;
var deleteBtn;

Survey
    .StylesManager
    .applyTheme("modern");

function sendResults(sender) {
    let results = JSON.stringify(sender.data);
    $.ajax({
        type: 'POST',
        url: '/send',
        data: {
            "results": results
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}


function deleteSurvey() {
    $.ajax({
        type: 'POST',
        url: '/deleteSurvey',
        data: {
            "id": deleteBtn
        },
        success: function (data) {
            $("#container").html("<br>Anketa izbrisana!<br>Stranica se ponovo učitava...");
            sleep(2000);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}


function generateSurvey(id) {
    titles = [];
    $.ajax({
        type: 'POST',
        url: '/surveyNames',
        data: {
            "id": id
        },
        success: function (data) {
            surveyID = data[0].names;
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
    $.ajax({
        type: 'POST',
        url: '/surveyType',
        data: {
            "id": id
        },
        async: false
    });
    $.ajax({
        type: 'POST',
        url: '/surveys',
        data: {
            "id": id
        },
        success: function (data) {
            surveyJson = data[0].title;
            var survey = new Survey.Model(surveyJson);
            survey.onComplete.add(sendResults);
            $("#container").Survey({ model: survey });
            mainTitle = surveyJson.title;
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}
function updateSurvey() {
    var output = '<br><label for="Anketa">Zalijepite JSON tekst za izmjenu ankete:</label>';
    output += '<br><textarea id="updateAnketa" name="updateAnketa" rows="40" cols="75">' + JSON.stringify(surveyJson) + '</textarea>';
    output += '<br><button id="updateJSON">Izmjeni</button>';
    $("#container").html(output);
    $("body").on("click", "#updateJSON", function () {
        $.ajax({
            type: 'POST',
            url: '/updateSurvey',
            data: {
                "json": $('#updateAnketa').val(),
                "id": deleteBtn
            },
            success: function (data) {
                $("#container").html("<br>Anketa izmjenjena!<br>Stranica se ponovo učitava...");
                sleep(2000);

            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: false
        });
    });
}

$("#chart").prop("disabled", true);

$("body").on("click", ".anketa", function () {
    $("#chart").prop("disabled", false);
    $("#tip").html("");
    deleteBtn = $(this).attr("id");
    $("#crud").html('<button class="button-34" id="delete' + deleteBtn + '" role="button" style="background-color: #b70000; box-shadow: #b70000 0 10px 20px -10px;" onclick="deleteSurvey()">Delete</button>');
    $("#crud").append('<button class="button-34" id="update' + deleteBtn + '" role="button" style="background-color: #b70000; box-shadow: #b70000 0 10px 20px -10px" onclick="updateSurvey()";">Update</button>');
    $("#crud").append('<br><br><button class="button-34" role="button" id="chart" style="background-color: #e26804ad; box-shadow: #e26804ad 0 10px 20px -10px;">Chart</button>');

});

$("body").on("click", ".novaAnketa", function () {
    $("#chart").prop("disabled", true);
    $("#tip").html("");
    $("#delete" + deleteBtn).prop("disabled", true);
    $("#update" + deleteBtn).prop("disabled", true);

});

$("body").on("click", "#chart", function () {
    $("#chart").prop("disabled", true);
    $("#delete" + deleteBtn).prop("disabled", true);
    $("#update" + deleteBtn).prop("disabled", true);
    var output = '<label for="charts">Odaberite tip grafikona</label>';
    output += '    <select name="charts" id="charts">';
    output += '        <option class="chartItem" value="bar">Bar</option>';
    output += '        <option class="chartItem" value="doughnut">Doughnut</option>';
    output += '        <option class="chartItem" value="pie">Pie</option>';
    output += '        <option class="chartItem" value="line">Line</option>';
    output += '    </select>';
    $("#tip").html(output);
});

$("body").on("click", "#nova", function () {
    var output = '<div><br><label for="novaAnketa">Zalijepite JSON tekst za anketu:</label>';
    output += '<br><textarea id="novaAnketa" name="novaAnketa" rows="40" cols="75"></textarea>';
    output += '<br><button id="saveJSON">Spremi</button>';
    $("#container").html(output);
});

$("body").on("click", "#saveJSON", function () {
    $.ajax({
        type: 'POST',
        url: '/insertSurvey',
        data: {
            "survey": $('#novaAnketa').val()
        },
        success: function (data) {
            $("#container").html("<br>Anketa spremljena!<br>Stranica se ponovo učitava...");
            sleep(2000);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
});


async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    location.reload();
}