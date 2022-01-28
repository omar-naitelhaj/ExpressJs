$(window).on("load", function() {
    $('.display').DataTable({
        dom: 'Bfrtip',
        buttons: [{
                extend: 'print',
                exportOptions: {
                    columns: [3]
                }
            },

            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [3]
                }
            },
            'colvis'
        ]
    });

    // function openForm() {
    //     document.getElementById("myForm").style.display = "block";
    //   }

    //   function closeForm() {
    //     document.getElementById("myForm").style.display = "none";
    //   }

});