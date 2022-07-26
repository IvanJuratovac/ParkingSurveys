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

const data = {
    labels: labels,
    datasets: [{
        label: 'Broj odabira',
        backgroundColor: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"],
        borderColor: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"],
        data: [7, 10, 5, 2, 20, 15, 23, 17],
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {}
};

$("body").on("click", "#chart", function () {
    $("#container").html("<canvas id=\"chartContainer\"></canvas>")
    const myChart = new Chart(document.getElementById('chartContainer'), config);
});
