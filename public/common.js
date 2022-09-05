const idrouter = 4;
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

function getRouterType() {
    return $.ajax({
        type: 'GET',
        url: 'router/type',
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

function getRouter() {
    return $.ajax({
        type: 'GET',
        url: 'router',
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

function getUser(email, password) {
    $.ajax({
        type: 'GET',
        url: 'hashing',
        data: {
            "password": password
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
    $.ajax({
        type: 'GET',
        url: 'users',
        data: {
            "email": email
        },
        success: function (data) {
            if (data.length == 0) {
                $('.modal').modal('show');
                console.log("Neuspješan login");
            }
            else {
                login(data[0].id);
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

function login(IDuser) {
    $.ajax({
        type: 'POST',
        url: 'login',
        data: {
            "IDuser": IDuser
        },
        success: function (data) {
            authenticate(data.accessToken);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

function authenticate(accessToken) {
    $.ajax({
        type: 'GET',
        url: 'token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + accessToken
        },
        success: function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                authorization(data.IDuser);
            }
            else {
                console.log("Neuspješan login");
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

function authorization(IDuser) {
    $.ajax({
        type: 'GET',
        url: 'authorization',
        data: {
            "iduser": IDuser,
            "idrouter": 4
        },
        success: function (data) {
            permissions.read = parseInt(data[0].read);
            permissions.insert = parseInt(data[0].insert);
            permissions.update = parseInt(data[0].update);
            permissions.delete = parseInt(data[0].delete);
            getTitles();
            $("#buttonContainer").show();
            $("#nova").show();
            $('.modal').hide();
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
        getUser(email, password);
    }
})