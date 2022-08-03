var labels = [];
var values = [];
var backgroundColor = [];
var titles = [];
var counts = {};
var mainTitle;
var chartType = "bar";

const chartColors = ["red", "blue", "green", "gold", "purple", "orange", "magenta", "brown", "cyan"];
var colorIndex = 0;
function incrementColor() {
    if (colorIndex < chartColors.length - 1) {
        colorIndex++;
    }
    else {
        colorIndex = 0;
    }
}



function jsonLooper(obj) {
    for (let k in obj) {
        if (k == "title" && obj[k] != mainTitle) {
            titles.push(obj[k]);
        }
        if (k == "text") {
            labels.push(obj[k]);
        }
        if (k == "value") {
            values.push(obj[k])
        }
        if (typeof obj[k] === "object") {
            jsonLooper(obj[k])
        }
    }
}

function drawChart(chartTitle, index, key) {
    var response;
    $.ajax({
        type: 'POST',
        url: '/results',
        data: {
            "key": key
        },
        success: function (data) {
            response = data;
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });

    $.each(response, function () {
        counts[this.name] = this.count;
    });

    if (labels.length == 0) {
        $.each(counts, function (key, value) {
            labels.push(key);
        });
    }
    $.each(labels, function () {
        backgroundColor.push(chartColors[colorIndex]);
        incrementColor();
    });
    var colorCounts = [];
    if (values.length == 0) {
        $.each(counts, function (key, value) {
            colorCounts.push(value);
        });
    }
    else {
        $.each(values, function () {
            colorCounts.push(counts[this]);
        });
    }
    Chart.register(ChartDataLabels);
    var data = {
        labels: labels,
        datasets: [{
            label: 'Broj odabira',
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            data: colorCounts
        }]
    };
    var datalabels;
    var legend;
    if (chartType == "bar") {
        legend = {
            display: false
        }
        datalabels = {
            display: true,
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
                weight: 'bold'
            }
        };
    }
    else {
        legend = {
            display: true
        }
        datalabels = {
            display: false
        };
    }
    var config = {
        type: chartType,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    padding: {
                        bottom: 30
                    },
                    font: {
                        size: 48
                    }
                },
                legend: legend,
                datalabels: datalabels
            }
        }
    };
    $("#container").append('<div class="chart' + index + '"><canvas id="chartContainer' + index + '"></canvas></div><br><br>');
    var myChart = new Chart(document.getElementById('chartContainer' + index), config);
}

function clickToDraw() {
    $("#container").html("");
    $('#chartContainer').remove();
    for (var i = 0; i < titles.length; i++) {
        drawChart(titles[i], i, surveyID[i]);
        backgroundColor = [];
        counts = {};
        labels = [];
        values = [];
    }
    console.log(titles);
    titles = [];
}

$("body").on("click", "#charts", function () {
    if (chartType != $("#charts").val()) {
        chartType = $("#charts").val();
        jsonLooper(surveyJson);
        clickToDraw();
    }
})
$("body").on("click", "#chart", function () {
    jsonLooper(surveyJson);
    clickToDraw();
});

