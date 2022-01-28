$(".custom-file-input").on("change", function() {
    var fileName = $(this)
        .val()
        .split("\\")
        .pop();
    $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
});

$(document).ready(function() {
    /*
    $.ajax({
        url : gestionurl,
        type: 'POST',
        data: {
            _token: $(document).find('meta[name=csrf-token]').attr('content'),
            op: 'afficher'
        },
        dataType: 'json',
        success:function(data){
            console.log(data);
            fillAll('.display',$('#content-prof'), data);
        },
        error: function(error){
            console.log(error);
        }

    });
    */

    $("#submitetudiant").click(function(e) {
        e.preventDefault();
        $.ajax({
            url: gestionurl,
            type: "POST",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "ajouter",
                nom: $("#nom").val(),
                prenom: $("#prenom").val(),
                email: $("#email").val(),
                cin: $("#cin").val(),
                id_filiere: $("#filiereselect").val()
            },
            dataType: "json",
            success: function(data) {
                hideerrormessage();
                if (data.error) {
                    hideErrorsAfterSubmit();
                    errorHandler(data.error);
                } else {
                    fillAll(".display", $("#content-prof"), data);
                    messagesHandler($(".errorcontainer"));
                    hideErrorsAfterSubmit();
                    viderchamp();
                }
            },
            error: function(error, textStatus, jqXHR) {
                console.log(error);
            }
        });
    });

    $(document).on("click", "#selectall", function(e) {
        selectAll();
    });

    $(document).on("change", "th[scope=row]>input", function(e) {
        if (checkedcount() > 0) {
            $("#delete").removeAttr("disabled");
        } else {
            $("#delete").attr("disabled", "disabled");
        }
    });

    $("#deletebutton").click(function(e) {
        e.preventDefault();

        $.ajax({
            url: gestionprofurl,
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
                fillAll(".display", $("#content-prof"), data);
            },
            error: function(error) {
                console.log(error);
            }
        });

        $("#deleteprof").modal("hide");
    });

    $(document).on("click", ".modifier", function(e) {
        e.preventDefault();
        element = $(this);
        $("#nomm").val(
            element
                .parent()
                .closest("tr")
                .find("td")
                .eq(0)
                .text()
        );
        $("#prenomm").val(
            element
                .parent()
                .closest("tr")
                .find("td")
                .eq(1)
                .text()
        );
        $("#emailm").val(
            element
                .parent()
                .closest("tr")
                .find("td")
                .eq(1)
                .text()
        );
        $("#cinm").val(
            element
                .parent()
                .closest("tr")
                .find("td")
                .eq(2)
                .text()
        );
        $.ajax({
            url: gestionprofurl,
            type: "POST",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "getemail",
                id: parseInt(
                    element
                        .parent()
                        .closest("tr")
                        .find("th")
                        .eq(0)
                        .attr("value")
                )
            },
            dataType: "json",
            success: function(data) {
                $("#emailm").val(data.email);
            },
            error: function(error) {
                console.log(error);
            }
        });

        sessionStorage.setItem(
            "idprof",
            parseInt(
                $(this)
                    .parent()
                    .closest("tr")
                    .find("th")
                    .eq(0)
                    .attr("value")
            )
        );
    });

    $("#modifier").click(function(e) {
        e.preventDefault();

        $.ajax({
            url: gestionprofurl,
            type: "post",
            data: {
                _token: $(document)
                    .find("meta[name=csrf-token]")
                    .attr("content"),
                op: "update",
                nom: $("#nomm").val(),
                prenom: $("#prenomm").val(),
                email: $("#emailm").val(),
                cin: $("#cinm").val(),
                id: sessionStorage.getItem("idprof")
            },
            dataType: "json",
            success: function(data) {
                if (data.error) {
                    hideErrorsAfterSubmit("modifier");
                    hideerrormessage();
                    errorHandler(data.error, "modifierform");
                    messagesHandler($(".errorparent"), "fail");
                    console.log(data.error);
                } else {
                    fillAll(".display", $("#content-prof"), data.data);
                    hideerrormessage();
                    $("#exampleModal").modal("hide");
                    $("#form-modifier")[0].reset();
                    hideErrorsAfterSubmit("modifier");
                    sessionStorage.removeItem("idprof");
                }
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
                ? msg + "ce professeur ? "
                : msg + checkedcount() + " professeurs ?";
        $(".confirmtext").text(message);
    });
});

// functions

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
                        .attr("value")
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
                $("#delete").attr("disabled", "disabled");
            });
        sessionStorage.removeItem("allchecked");
        return;
    }

    $(document)
        .find("th[scope=row]>input")
        .each(function() {
            $(this)
                .eq(0)
                .prop("checked", true);
            $("#delete").removeAttr("disabled");
            checkedids();
        });
    sessionStorage.setItem("allchecked", true);
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
            '<div class="alert alert-success success m-3" role="alert">Les données sont  enregistrées avec succée</div>'
        );
    } else if (type == "faildatabase") {
        selector.prepend(
            '<div class="alert alert-danger m-3 fail">Problem lors de la connexion avec la database ressayer à nouveau ulterieurement </div>'
        );
    } else if (type == "fail") {
        selector.prepend(
            '<div class="alert alert-danger fail m-3" role="alert">Veuillez verifier la validité des valeurs entrées</div>'
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

function remplir(selector, myData) {
    var ligne = "";

    for (let i = 0; i < myData.length; i++) {
        ligne +=
            '<tr><th scope="row" value="' +
            myData[i].id +
            '"><input type="checkbox" name="profs" value="">&nbsp' +
            (i + 1) +
            "</th>";
        ligne += "<td> " + myData[i].nom + "</td>";
        ligne += "<td> " + myData[i].prenom + "</td>";
        ligne +=
            "<td> " +
            (myData[i].cin == null ? "Pas de cin" : myData[i].cin) +
            "</td>";
        ligne +=
            '<td class="text-center"><button type="button" class="btn btn-primary modifier" title="Modifier un element" data-bs-toggle="modal" data-bs-target="#exampleModal">Modifier</button></td></tr>';
    }

    selector.html(ligne);
}

function fillAll(table, selector, myData) {
    if ($.fn.DataTable.isDataTable(table)) {
        $(table)
            .DataTable()
            .destroy();
    }
    remplir(selector, myData);
    $(table).DataTable({
        order: []
    });
}

function viderchamp() {
    $("#nom").val("");
    $("#prenom").val("");
    $("#prenom").val("");
    $("#cin").val("");
    $("#filiereselect").prop("selectedIndex", 0);
}

function errorHandler(myData, type = "form") {
    if (type == "form") {
        for (const property in myData) {
            if (property == "email") {
                $(".emailcontainer").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#email").addClass("is-invalid");
            } else if (property == "cin") {
                $(".cincontainer").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#cin").addClass("is-invalid");
            } else if (property == "nom") {
                $(".nomcontainer").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#nom").addClass("is-invalid");
            } else if (property == "prenom") {
                $(".prenomcontainer").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#prenom").addClass("is-invalid");
            } else if (property == "id_filiere") {
                $(".filiereselect").addClass("is-invalid");
                $(".filierecontainer").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
            }
        }
    } else if (type == "modifierform") {
        for (const property in myData) {
            if (property == "email") {
                $(".emailcontainerm").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#emailm").addClass("is-invalid");
            } else if (property == "cin") {
                $(".cincontainerm").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#cinm").addClass("is-invalid");
            } else if (property == "nom") {
                $(".nomcontainerm").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#nomm").addClass("is-invalid");
            } else if (property == "prenom") {
                $(".prenomcontainerm").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
                $("#prenomm").addClass("is-invalid");
            } else if (property == "id_filiere") {
                $(".filiereselect").addClass("is-invalid");
                $(".filierecontainer").append(
                    '<span class="text-danger failmessage">' +
                        myData[property] +
                        "</span>"
                );
            }
        }
    }
}

function hideErrorsAfterSubmit(option = "ajouter") {
    if (option == "modifier") {
        $("#form-modifier :input").each(function() {
            if ($(this).hasClass("is-invalid")) {
                $(this).removeClass("is-invalid");
            }
        });
        return;
    }
    $(".formcontainer :input").each(function() {
        if ($(this).hasClass("is-invalid")) {
            $(this).removeClass("is-invalid");
        }
    });
}

function hideerrormessage() {
    if ($(".failmessage")) {
        $(".failmessage").hide();
    }
}
