$(document).ready(function() {
    showAll();

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

    $("#submitelement").click(function(e) {
        e.preventDefault();

        if ($("#nom").val() && $("#module").val() && $("#profselect").val()) {
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "ajouter",
                    nom: $("#nom").val(),
                    id_module: $("#module")
                        .find(":selected")
                        .val(),
                    id_prof: $("#profselect")
                        .find(":selected")
                        .val()
                },
                dataType: "json",
                success: function(data) {
                    $(".display")
                        .DataTable()
                        .destroy();
                    remplir($("#content-element"), data);
                    $(".display").DataTable();

                    $("#nom").val("");
                    $("#filiere").prop("selectedIndex", 0);
                    $("#module").prop("selectedIndex", 0);
                    $("#profselect").prop("selectedIndex", 0);

                    messagesHandler($(".error-ajout"));
                },
                error: function(error) {
                    messagesHandler($(".error-ajout"), "faildatabase");
                    console.log(error);
                }
            });
        } else {
            messagesHandler($(".error-ajout"), "fail");
        }
    });

    $(document).on("change", "#filiere", function() {
        // checking if the selected option is valid
        if (
            $("#filiere")
                .find(":selected")
                .val()
        ) {
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "listemodule",
                    id_filiere: $("#filiere").val()
                },
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    remplirselect(data, $("#module"));
                    $("#module").prop("disabled", false);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    });

    $(document).on("change", "#filierem", function() {
        // checking if the selected option is valid
        if (
            $("#filierem")
                .find(":selected")
                .val()
        ) {
            $("#modulem").prop("disabled", false);
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "listemodule",
                    id_filiere: $("#filierem").val()
                },
                dataType: "json",
                success: function(data) {
                    remplirselect(data, $("#modulem"));
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } else {
            $("#modulem").prop("disabled", true);
        }
    });
    $(document).on("change", "#filieresearch", function() {
        // checking if the selected option is valid
        if (
            $("#filieresearch")
                .find(":selected")
                .val()
        ) {
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "listemodule",
                    id_filiere: $("#filieresearch").val()
                },
                dataType: "json",
                success: function(data) {
                    remplirselect(data, $("#modulesearch"));
                    $("#modulesearch").prop("disabled", false);
                    // remplir($("#content-element"), data);
                    // $('.display').DataTable();
                },
                error: function(error) {
                    console.log(error);
                }
            });
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "filitrage",
                    id_filiere: $("#filieresearch").val(),
                    filtrageOp: "filiere"
                },
                dataType: "json",
                success: function(data) {
                    $(".display")
                        .DataTable()
                        .destroy();
                    remplir($("#content-element"), data);
                    $(".display").DataTable();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } else {
            $(".display")
                .DataTable()
                .destroy();
            showAll();
            $("#modulesearch").attr("disabled", "disabled");
        }
    });

    $(document).on("change", "#modulesearch", function() {
        if ($("#modulesearch").val()) {
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "filitrage",
                    id_module: $("#modulesearch").val(),
                    filtrageOp: "module"
                },
                dataType: "json",
                success: function(data) {
                    $(".display")
                        .DataTable()
                        .destroy();
                    remplir($("#content-element"), data);
                    $(".display").DataTable();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } else {
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "filitrage",
                    id_filiere: $("#filieresearch").val(),
                    filtrageOp: "filiere"
                },
                dataType: "json",
                success: function(data) {
                    $(".display")
                        .DataTable()
                        .destroy();
                    remplir($("#content-element"), data);
                    $(".display").DataTable();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    });

    $("#delete").click(function(e) {
        e.preventDefault();
        var msg = "Veuillez vous vraiment supprimer ";
        var message =
            checkedcount() == 1
                ? msg + "cet element ? "
                : msg + checkedcount() + " elements ?";
        $(".confirmtext").text(message);
    });

    $("#deletebutton").click(function(e) {
        e.preventDefault();

        $.ajax({
            url: gestionelementurl,
            type: "post",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "delete",
                items: checkedids()
            },
            dataType: "json",
            success: function(data) {
                $(".display")
                    .DataTable()
                    .destroy();
                remplir($("#content-element"), data);
                $(".display").DataTable();
            },
            error: function(error) {
                console.log(error);
            }
        });

        $("#deleteelement").modal("hide");
    });

    $(document).on("click", ".modifier", function(e) {
        e.preventDefault();

        element = $(this);

        $.ajax({
            url: gestionelementurl,
            type: "post",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "filiere",
                id_module: parseInt(
                    $(this)
                        .parent()
                        .closest("tr")
                        .find("td")
                        .eq(1)
                        .attr("value")
                )
            },
            dataType: "json",
            success: function(data) {
                $("#nomm").val(
                    element
                        .parent()
                        .closest("tr")
                        .find("td")
                        .eq(0)
                        .text()
                );
                selectItem(
                    $("#filierem"),
                    parseInt(
                        element
                            .parent()
                            .closest("tr")
                            .find("td")
                            .eq(1)
                            .attr("value")
                    )
                );
                remplirselectserver(
                    data.modules,
                    $("#modulem"),
                    parseInt(
                        element
                            .parent()
                            .closest("tr")
                            .find("td")
                            .eq(1)
                            .attr("value")
                    )
                );
                selectItem(
                    $("#professeurm"),
                    parseInt(
                        element
                            .parent()
                            .closest("tr")
                            .find("td")
                            .eq(2)
                            .attr("value")
                    )
                );
                console.log(
                    element
                        .parent()
                        .closest("tr")
                        .find("td")
                        .eq(2)
                        .attr("value")
                );
                sessionStorage.setItem(
                    "idelement",
                    parseInt(
                        element
                            .parent()
                            .closest("tr")
                            .find("th")
                            .eq(0)
                            .text()
                    )
                );
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#modifier").click(function(e) {
        e.preventDefault();
        if (
            $("#professeurm").val() &&
            $("#modulem").val() &&
            $("#filierem").val() &&
            $("#nomm").val()
        ) {
            $.ajax({
                url: gestionelementurl,
                type: "post",
                data: {
                    _token: $(document)
                        .find("meta[name=csrf-token]")
                        .attr("content"),
                    op: "update",
                    nom: $("#nomm").val(),
                    id_module: $("#modulem").val(),
                    id: sessionStorage.getItem("idelement"),
                    id_prof: $("#professeurm").val()
                },
                dataType: "json",
                success: function(data) {
                    $(".display")
                        .DataTable()
                        .destroy();
                    remplir($("#content-element"), data);
                    $(".display").DataTable();
                },
                error: function(error) {
                    console.log(error);
                }
            });

            sessionStorage.removeItem("idelement");
            $("#exampleModal").modal("hide");
            $("#form-modifier")[0].reset();
        } else {
            messagesHandler($(".errorparent"), "fail");
        }
    });
});

function remplir(selector, myData) {
    var ligne = "";

    for (let i = 0; i < myData.length; i++) {
        ligne +=
            '<tr><th scope="row"><input type="checkbox" name="elemets" value=""> &nbsp ' +
            myData[i].id +
            "</th>";
        ligne += "<td> " + myData[i].nom + "</td>";
        ligne +=
            '<td value="' +
            myData[i].module.id +
            '"> ' +
            myData[i].module.nom +
            "</td>";
        ligne +=
            '<td value="' +
            myData[i].professeur.id +
            '"> ' +
            myData[i].professeur.nom +
            "</td>";
        ligne +=
            '<td class="text-center"><button type="button" class="btn btn-primary modifier" title="Modifier un element" data-bs-toggle="modal" data-bs-target="#exampleModal">Modifier</button></td></tr>';
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

function remplirselect(myData, selector) {
    lignes = '<option value="">Choisissez un module</option>';
    for (let i = 0; i < myData.length; i++) {
        lignes +=
            '<option value="' +
            myData[i].id +
            '">' +
            myData[i].nom +
            "</option>";
    }
    selector.html(lignes);
}

function showAll() {
    $.ajax({
        url: gestionelementurl,
        type: "post",
        data: {
            _token: $(document)
                .find("meta[name=csrf-token]")
                .attr("content"),
            op: "afficher"
        },
        dataType: "json",
        success: function(data) {
            remplir($("#content-element"), data);
            $(".display").DataTable();
        },
        error: function(error) {
            console.log(error);
        }
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

function messagesHandler(selector, type = "success") {
    if (type == "success") {
        selector.prepend(
            '<div class="alert alert-success m-3 success"> </div>'
        );
    } else if (type == "faildatabase") {
        selector.prepend(
            '<div class="alert alert-danger m-3 fail">Problem lors de la connexion avec la database ressayer à nouveau ulterieurement </div>'
        );
    } else if (type == "fail") {
        selector.prepend(
            '<div class="alert alert-danger m-3 fail">Veuillez verifier la validité des valeurs entrées </div>'
        );
    }

    hideMessage();
}

function selectItem(selector, Item) {
    selector.children().each(function() {
        if ($(this).attr("value") == Item) {
            $(this).prop("selected", true);
        }
    });
}

function remplirselectserver(myData, selector, item) {
    lignes = '<option value="">Choisissez un module</option>';
    for (let i = 0; i < myData.length; i++) {
        if (myData[i].id == item) {
            lignes +=
                '<option value="' +
                myData[i].id +
                '" selected>' +
                myData[i].nom +
                "</option>";
        } else {
            lignes +=
                '<option value="' +
                myData[i].id +
                '">' +
                myData[i].nom +
                "</option>";
        }
    }
    selector.html(lignes);
}
