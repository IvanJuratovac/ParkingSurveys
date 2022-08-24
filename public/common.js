var email;
var password;

modal();

function modal() {
    var output = '';
    output += '<div data-backdrop="static" style="zoom: 120%; position: absolute; top: 25%;" class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
    output += '    <div class="modal-dialog modal-dialog-centered" role="document">';
    output += '        <div class="modal-content">';
    output += '            <div class="modal-body">';
    output += '                <div style="margin-left: 150px;">';
    output += '                    <b>E-mail</b><br>';
    output += '                    <input type="text" id="inputEmail"><br>';
    output += '                    <b>Lozinka</b><br>';
    output += '                    <input type="password" id="inputPassword">';
    output += '                </div>';
    output += '            </div>';
    output += '            <div class="modal-footer">';
    output += '                <button type="button" class="btn btn-primary" id="getLogin">Prijava</button>';
    output += '            </div>';
    output += '        </div>';
    output += '    </div>';
    output += '</div>';
    $('.modal-container').html(output);
}

function getAuthorization(res) {
    $.ajax({
        type: 'POST',
        url: '/getAuthorization',
        data: {
            "iduser": res[0].id,
            "idrouter": "4"
        },
        success: function (data) {
            console.log(data);
            $("#buttonContainer").show();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

$(document).on('click', '#getLogin', function () {
    var email = $('#inputEmail').val();
    var password = $('#inputPassword').val();
    if (email == null || email == "") {
        console.log('Molimo unesite email adresu');
    } else if (password == null || password == "") {
        console.log('Molimo unesite zaporku');
    } else {
        $.ajax({
            type: 'POST',
            url: '/getUser',
            data: {
                "email": email,
                "password": password
            },
            success: function (data) {
                console.log(data);
                if (data.length == 0) {
                    $('.modal').modal('show');
                    console.log("unesite ispravne podatke");
                }
                else {
                    $('.modal').hide();
                    console.log("Uspješan login");
                    getAuthorization(data);
                }
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: false
        });
    }
})