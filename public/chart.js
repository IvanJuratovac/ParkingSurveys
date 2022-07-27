const labels = [
    'crvena',
    'plava',
    'zelena',
    'žuta',
    'ljubičasta',
    'narandžasta',
    'roza',
    'tirkizna',
];

$("body").on("click", "#chart", function () {
    var boje;
    $.ajax({
        type: 'POST',
        url: '/results',
        data: {
            "key": "boje"
        },
        success: function (data) {
            boje = data;
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });

    var counts = [];
    $.each(boje, function () {
        counts[this.colors] = this.count;
    });
    //console.log(counts);

    const data = {
        labels: labels,
        datasets: [{
            label: 'Broj odabira',
            backgroundColor: ["red", "blue", "green", "yellow", "purple", "orange", "magenta", "cyan"],
            borderColor: ["red", "blue", "green", "yellow", "purple", "orange", "magenta", "cyan"],
            data: [counts.red, counts.blue, counts.green, counts.yellow, counts.purple, counts.orange, counts.magenta, counts.cyan],
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };

    $("#container").html("<canvas id=\"chartContainer\"></canvas>");
    const myChart = new Chart(document.getElementById('chartContainer'), config);
});
