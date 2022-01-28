$(document).ready(function() {
    $.ajax({
        url: gestionfiliereurl,
        type: "post",
        data: {
            _token: $(document)
                .find("meta[name=csrf-token]")
                .attr("content"),
            op: "afficher"
        },
        success: function(data) {
            console.log(data);
            remplir($("#content-filiere"), data);
            $(".display").DataTable();
        },
        error: function(error) {
            console.log(error);
        }
    });

    $(document).on("change", "th[scope=row]>input", function(e) {
        if (checkedcount() > 0) {
            $("#delete").removeAttr("disabled");
        } else {
            $("#delete").attr("disabled", "disabled");
        }
    });

    $(document).on("click", "#selectall", function(e) {
        selectAll();
    });

    $("#add").submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: gestionfiliereurl,
            type: "post",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "ajouter",
                code: $("#code").val(),
                libelle: $("#libelle").val()
            },
            dataType: "json",
            success: function(data) {
                $(document)
                    .find(".failfield")
                    .hide();
                console.log(data);
                if (data.error) {
                    showError(data.error);
                } else if (data.message.title == "fail") {
                    $("#add").prepend(
                        '<div class="alert alert-danger m-3 fail">' +
                            data.message.message +
                            "</div>"
                    );
                } else if (data.message.title == "success") {
                    $("#add").prepend(
                        '<div class="alert alert-success m-3 success">' +
                            data.message.message +
                            "</div>"
                    );
                    remplir($("#content-filiere"), data.data);
                    $("#add")[0].reset();
                }
                // if (data.message.title == "fail") {
                //     $("#add").prepend(
                //         '<div class="alert alert-danger m-3 fail">' +
                //             data.message.message +
                //             "</div>"
                //     );
                // } else if (data.message.title == "success") {
                //     $("#add").prepend(
                //         '<div class="alert alert-success m-3 success">' +
                //             data.message.message +
                //             "</div>"
                //     );
                // }

                // $(".display")
                //     .DataTable()
                //     .destroy();
                // remplir($("#content-filiere"), data.data);
                // $(".display").DataTable();

                hideMessage();
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
    $("#delete").click(function(e) {
        e.preventDefault();
        var msg = "Veuillez vous vraiment supprimer ";
        var message =
            checkedcount() == 1
                ? msg + "cette filiere ? "
                : msg + checkedcount() + " filieres ?";
        $(".confirmtext").text(message);
    });

    $("#deletebutton").click(function(e) {
        e.preventDefault();

        $.ajax({
            url: gestionfiliereurl,
            type: "post",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "delete",
                items: checkedids()
            },
            success: function(data) {
                $(".display")
                    .DataTable()
                    .destroy();
                remplir($("#content-filiere"), data);
                $(".display").DataTable();
            },
            error: function(error) {
                console.log(error);
            }
        });

        $("#deletefiliere").modal("hide");
    });

    $(document).on("click", ".modifier", function(e) {
        e.preventDefault();
        $("#codem").val(
            $(this)
                .parent()
                .closest("tr")
                .find("td")
                .eq(0)
                .text()
        );
        $("#libellem").val(
            $(this)
                .parent()
                .closest("tr")
                .find("td")
                .eq(1)
                .text()
        );
        sessionStorage.setItem(
            "idfiliere",
            parseInt(
                $(this)
                    .parent()
                    .closest("tr")
                    .find("th")
                    .eq(0)
                    .text()
            )
        );
    });

    $("#modifier").click(function(e) {
        e.preventDefault();
        if ($("#codem").val() && $("#libellem").val()) {
            $.ajax({
                url: gestionfiliereurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "update",
                    code: $("#codem").val(),
                    libelle: $("#libellem").val(),
                    id: sessionStorage.getItem("idfiliere")
                },
                success: function(data) {
                    $(".display")
                        .DataTable()
                        .destroy();
                    remplir($("#content-filiere"), data);
                    $(".display").DataTable();
                },
                error: function(error) {
                    console.log(error);
                }
            });

            sessionStorage.removeItem("idfiliere");
            $("#exampleModal").modal("hide");
            $("#form-modifier")[0].reset();
        } else {
            $(".errorparent").prepend(
                '<div class="alert alert-danger m-3 fail">Check your entry</div>'
            );
            hideMessage();
        }
    });
});

function remplir(selector, myData) {
    var ligne = "";

    for (let i = 0; i < myData.length; i++) {
        ligne +=
            '<tr><th scope="row"><input type="checkbox" name="filieres" value=""> &nbsp ' +
            myData[i].id +
            "</th>";
        ligne += "<td> " + myData[i].code + "</td>";
        ligne += "<td> " + myData[i].libelle + "</td>";
        ligne +=
            '<td class="text-center"><button type="button" class="btn btn-primary modifier" title="Modifier une filiere" data-bs-toggle="modal" data-bs-target="#exampleModal">Modifier</button></td></tr>';
    }

    selector.html(ligne);
}

function checkedcount() {
    var count = 0;
    $(document)
        .find("th[scope=row]>input:checked")
        .each(function() {
            count++;
        });
    return count;
}
function checkedids() {
    var ids = new Array();
    $(document)
        .find("th[scope=row]>input:checked")
        .each(function() {
            ids.push(
                parseInt(
                    $(this)
                        .parent()
                        .text()
                )
            );
        });
    return ids;
}

function selectAll() {
    if (sessionStorage.getItem("allchecked")) {
        $(document)
            .find("th[scope=row]>input")
            .each(function() {
                $(this)
                    .eq(0)
                    .prop("checked", false);
                sessionStorage.removeItem("allchecked");
                $("#delete").attr("disabled", "disabled");
            });
        return;
    }

    $(document)
        .find("th[scope=row]>input")
        .each(function() {
            $(this)
                .eq(0)
                .prop("checked", true);
            sessionStorage.setItem("allchecked", true);
            $("#delete").removeAttr("disabled");
        });
}

function hideMessage() {
    if ($(".fail")) {
        setTimeout(function() {
            $(".fail").hide();
        }, 5000);
    }
    if ($(".success")) {
        setTimeout(function() {
            $(".success").hide();
        }, 5000);
    }
}

function showError(data) {
    for (property in data) {
        if (property == "code") {
            $(".codecontainer").append(
                '<span class="text text-danger m-3 failfield">' +
                    data[property] +
                    "</span>"
            );
        } else if (property == "libelle") {
            $(".libellecontainer").append(
                '<span class="text text-danger m-3 failfield">' +
                    data[property] +
                    "</span>"
            );
        }

        //console.log(data[property]);
    }
}

function hideError() {
    $(".fail").hide();
}
