var surveyID;
var surveyJson;
var idcontrols;
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
            "details": results,
            "idcontrols": idcontrols,
            "idupdated": 1,
            "idcreated": 1
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true
    });
}

function generateSurvey(id) {
    idcontrols = id;
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
        async: true
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
            $('#loading').hide();
            $('#container').show();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true
    });
}

$.ajax({
    type: 'GET',
    url: '/titles',
    success: function (data) {
        $("#buttonContainer").hide();
        $("#crud").show();
        $("#buttonContainer").html("");
        $.each(data, function (key, value) {
            $("#buttonContainer").append('<button class="button-34 anketa" id="' + value.id + '" role="button" onclick="generateSurvey(\'' + value.id + '\')">' + value.title + '</button>');
        });
        $('#loading').hide();
    },
    error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
    },
    async: true
});

$("#chart").prop("disabled", true);

$("body").on("click", ".anketa", function () {
    $('#loading').show();
    $('#container').hide();
    $("#chart").prop("disabled", false);
    $("#tip").html("");
    deleteBtn = $(this).attr("id");
    $("#crud").html('<button class="button-34" id="delete' + deleteBtn + '" role="button" style="background-color: #b70000; box-shadow: #b70000 0 10px 20px -10px;">Delete</button>');
    $("#crud").append('<button class="button-34" id="update' + deleteBtn + '" role="button" style="background-color: #b70000; box-shadow: #b70000 0 10px 20px -10px">Update</button>');
    $("#crud").append('<br><br><button class="button-34" role="button" id="chart" style="background-color: #e26804ad; box-shadow: #e26804ad 0 10px 20px -10px;">Chart</button>');
});

$("body").on("click", "#chart", function () {
    $("#chart").prop("disabled", true);
    $("#delete" + deleteBtn).prop("disabled", true);
    $("#update" + deleteBtn).prop("disabled", true);
    var output = '<label for="charts">Odaberite tip grafikona</label>';
    output += '    <select name="charts" id="charts">';
    output += '        <option value="">---Odaberite---</option>';
    output += '        <option value="bar">Bar</option>';
    output += '        <option value="doughnut">Doughnut</option>';
    output += '        <option value="pie">Pie</option>';
    output += '    </select>';
    $("#tip").html(output);
});

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    location.reload();
}