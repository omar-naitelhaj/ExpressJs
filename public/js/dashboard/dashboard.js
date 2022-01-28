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
    "#FF6060",
    "#60FF60",
    "#6060FF",
    "#E666B3",
    "#4DB3FF",
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


$(document).ready(function () {

    var chart
    var chart1
    var chart2

    var array1 = []
    var array2 = []
    var array3 = []
    var array4 = []
    var array5 = []
    var array6 = []


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

            const hahaha = data[0].array3.map((statistique) => {
                const { salle, nbr } = statistique
                array5.push(salle)
                array6.push(nbr)
                console.log(array6)
            })
            
            barChart(document.getElementById("occupationsDates").getContext("2d"), array3, array4);
            barChart1(document.getElementById("sallesBlocs").getContext("2d"), array1, array2);
            barChart2(document.getElementById("occupationSemaine").getContext("2d"), array5, array6);


        },
        error: function (error) {
            console.log(error);
        }
    });

    function barChart(context, array1, array2) {

        chart = new Chart(context, {
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

        chart1 = new Chart(context, {
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
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Salles par Bloc",
                        position : "bottom"
                    }
                },
            }
        });
    }


    function barChart2(context, array1, array2) {

        chart2 = new Chart(context, {
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
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Occupation par Semaine",
                        position : "bottom"
                    }
                },
            }
        });
    }

    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8080');
    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('tfo');

        $.ajax({
            url: "/dashboard/chart",
            type: "get",
            data: {
            },
            dataType: "json",
            success: function (data) {
                array3 = [];
                array4 = [];
                const ha = data[0].array2.map((statistique) => {
                    const { date, nbrOccupation } = statistique
                    array3.push(date)
                    array4.push(nbrOccupation)
                })
                const hahaha = data[0].array3.map((statistique) => {
                    const { salle, nbr } = statistique
                    array5.push(salle)
                    array6.push(nbr)
                    console.log(array6)
                })
                chart2.destroy();
                chart.destroy();

                barChart2(document.getElementById("occupationsDates").getContext("2d"), array5, array6);
                barChart(document.getElementById("occupationsDates").getContext("2d"), array3, array4);

            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log('suuuuuuuuuuuuuuuuui');
    });

});