const idrouter = 45;
var email;
var password;
var permissions = {
    "read": 0,
    "insert": 0,
    "update": 0,
    "delete": 0
}

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

function routerGetName() {
    return $.ajax({
        type: 'POST',
        url: '/routerGetName',
        data: {
            "id": idrouter
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

function getAuthorization(res) {
    $.ajax({
        type: 'POST',
        url: '/getAuthorization',
        data: {
            "iduser": res[0].id,
            "idrouter": 45
        },
        success: function (data) {
            permissions.read = parseInt(data[0].read);
            permissions.insert = parseInt(data[0].insert);
            permissions.update = parseInt(data[0].update);
            permissions.delete = parseInt(data[0].delete);
            getTitles();
            $("#buttonContainer").show();
            routerGetName();
            $("#nova").show();
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