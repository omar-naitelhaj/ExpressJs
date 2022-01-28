var colorArray = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF"
];

var colorArray1 = [
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#4D8000",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC"
];

var token = $(document)
    .find("meta[name=csrf-token]")
    .attr("content");

$(document).ready(function () {

    var array1 = []
    var array2 = []
    var array3 = []
    var array4 = []

    $.ajax({
        url: "/dashboard/chart",
        type: "get",
        data: {
        },
        dataType: "json",
        success: function (data) {

            const haha = data[0].array1.map((statistique) => {
                const { bloc, nbrSalle } = statistique
                array1.push(bloc)
                array2.push(nbrSalle)
            })

            const ha = data[0].array2.map((statistique) => {
                const { date, nbrOccupation } = statistique
                array3.push(date)
                array4.push(nbrOccupation)
            })

            barChart(document.getElementById("sallesBlocs").getContext("2d"), array3, array4);
            barChart1(document.getElementById("occupationsDates").getContext("2d"), array1, array2);

            // Create WebSocket connection.
            const socket = new WebSocket('ws://localhost:8080');

            // Listen for messages
            socket.addEventListener('message', function (event) {
             console.log('suuuuuuuuuuuuuuuuui');
            location.reload();

        });
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function InsertValueInSelector(value) {
    selector.text(value);
}

function barChart(context, array1, array2) {

    let chart = new Chart(context, {
        type: "bar",
        data: {
            labels: array1,
            datasets: [
                {
                    data: array2,
                    backgroundColor: colorArray
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        generateLabels: function (chart) {
                            return chart.data.labels.map(function (label, i) {
                                return {
                                    text: label,
                                    fillStyle: colorArray[i]
                                };
                            });
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Occupation par date"
                }
            },

            scales: {
                y: {
                    title: {
                        display: true,
                        text: "nombre des occupations"
                    },
                    beginAtZero: true
                },
                x: {
                    title: {
                        display: true,
                        text: "Dates"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}


function barChart1(context, array1, array2) {

    let chart1 = new Chart(context, {
        type: "doughnut",
        data: {
            labels: array1,
            datasets: [
                {
                    data: array2,
                    backgroundColor: colorArray1
                }
            ]
        },

    });
}
