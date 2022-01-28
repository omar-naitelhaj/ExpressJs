$(document).ready(function(){

    $.ajax({
        url: gestionmoduleurl,
        type: 'post',
        data: {
            _token: $(document).find('meta[name=csrf-token]').attr('content'),
            op: 'afficher'
        },
        dataType: 'json',
        success: function(data){
            remplir($("#content-module"), data);
            $('.display').DataTable();
        },
        error: function(error){
            console.log(error);
        }

        
    });

    $('#modulesubmit').click(function(e){
        e.preventDefault();
        if($('#nom').val() && $('#filiere').val()){
            $.ajax({
                url: gestionmoduleurl,
                type: 'post',
                data: {
                    _token: $(document).find('meta[name=csrf-token]').attr('content'),
                    op: 'ajouter',
                    nom: $('#nom').val(),
                    id_filiere: $('#filiere').val()
                },
                success: function(data){
                    $('.display').DataTable().destroy();
                    remplir($("#content-module"), data.data);
                    $('.display').DataTable();
                },
                error: function(error){
                    console.log(error);
                }
        
                
            });

            $('#nom').val('');
            $('#filiere').prop('selectedIndex',0);


        } else {
            $('.error-ajout').prepend('<div class="alert alert-danger m-3 fail">Veuillez entrer des informations valide</div>');
            hideMessage();
        }
    });

    $(document).on('change', 'th[scope=row]>input', function(e){
        if(checkedcount() > 0){
            $('#delete').removeAttr('disabled');
        } else {
            $('#delete').attr('disabled', 'disabled');
        }
    });

    $(document).on('click', '#selectall', function(e){
        selectAll();

    });

    $('#delete').click(function(e){
        e.preventDefault();
        var msg = 'Veuillez vous vraiment supprimer '
        var message = checkedcount() == 1 ? msg + ' çe module ? ' : msg + checkedcount() + ' modules ?';
        $('.confirmtext').text(message);
    });

    $('#deletebutton').click(function(e){
        e.preventDefault();

        $.ajax({
            url: gestionmoduleurl,
            type: 'post',
            data: {
                _token: $(document).find('meta[name=csrf-token]').attr('content'),
                op: 'delete',
                items: checkedids()
            },
            success: function(data){
                $('.display').DataTable().destroy();
                remplir($("#content-module"), data);
                $('.display').DataTable();
               
            },
            error: function(error){
                console.log(error);
            }
    
            
        });

        $('#deletemodule').modal('hide');
    });

    $(document).on('click', '.modifier', function(e){
        e.preventDefault();
        $('#nomm').val($(this).parent().closest('tr').find('td').eq(0).text());
        var idfiliere = parseInt($(this).parent().closest('tr').find('td').eq(1).attr('value'));
        sessionStorage.setItem('idmodule', parseInt($(this).parent().closest('tr').find('th').eq(0).text()));
        clearSelect($('#filierem'));
        $('#filierem').children().each(function(){
            if($(this).val() == idfiliere){
                console.log('ok');
                $(this).attr('selected', 'selected');
            }
        });
    });

    $('#modifier').click(function(e){
        e.preventDefault();

        if($('#nomm').val() && $('#filierem').val()){

            $.ajax({
                url: gestionmoduleurl,
                type: 'post',
                data: {
                    _token: $(document).find('meta[name=csrf-token]').attr('content'),
                    op: 'update',
                    id : sessionStorage.getItem('idmodule'),
                    nom: $('#nomm').val(),
                    id_filiere : $('#filierem').find(':selected').val()
                },
                dataType: 'json',
                success: function(data){
                    
                    $('.display').DataTable().destroy();
                    remplir($("#content-module"), data);
                    $('.display').DataTable();
                    
                   
                },
                error: function(error){
                    console.log(error);
                }
        
                
            });
            $('#exampleModal').modal('hide');
        }
    });


    




});

function checkedcount(){
    var count = 0;
    $(document).find('th[scope=row]>input:checked').each(function(){
        count++;
    });
    return count;
}
function checkedids(){
    var ids = new Array();
    $(document).find('th[scope=row]>input:checked').each(function(){
        ids.push(parseInt($(this).parent().text()));
    });
    return ids;
}

function selectAll(){
    if(sessionStorage.getItem('allchecked')){
        $(document).find('th[scope=row]>input').each(function(){
            $(this).eq(0).prop('checked', false);
            sessionStorage.removeItem('allchecked');
            $('#delete').attr('disabled', 'disabled');
        });
        return;
    }

    $(document).find('th[scope=row]>input').each(function(){
        $(this).eq(0).prop('checked', true);
        sessionStorage.setItem('allchecked', true);
        $('#delete').removeAttr('disabled');

    });
}

function remplir(selector, myData){
    
    var ligne = "";

    for(let i=0; i<myData.length; i++){
        ligne+= '<tr><th scope="row"><input type="checkbox" name="modules" value=""> &nbsp '+ myData[i].id + '</th>';
        ligne+= '<td> ' + myData[i].nom + '</td>';
        ligne+= '<td value="'+myData[i].filiere.id+'"> ' + myData[i].filiere.code + '</td>';
        ligne+= '<td class="text-center"><button type="button" class="btn btn-primary modifier" title="Modifier un module" data-bs-toggle="modal" data-bs-target="#exampleModal">Modifier</button></td></tr>';


    }

    selector.html(ligne);
}

function hideMessage(){
    if($('.fail')){
        setTimeout(function(){
            $('.fail').hide();
        }, 5000);
    }
    if($('.success')){
        setTimeout(function(){
            $('.success').hide();
        }, 5000);   
    }

}
// TODO check if i need this
function clearSelect(selector){
    selector.children().each(function(e){
        if($(this).selected){
            $(this).attr('selected', false);
        }
    });
}