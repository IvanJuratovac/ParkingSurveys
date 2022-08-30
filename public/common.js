const idrouter = 13;
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
        type: 'POST',
        url: '/getRouterType',
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
        type: 'POST',
        url: '/getRouter',
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

function authenticate(accessToken, res) {
    $.ajax({
        type: 'GET',
        url: '/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + accessToken
        },
        success: function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                console.log("Uspješan login");
                console.log(data);
                $('.modal').hide();
                getAuthorization(res);
            }
            else {
                console.log(data);
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

function login(email, res) {
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            "username": email
        },
        success: function (data) {
            authenticate(data.accessToken, res);
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
                login(email, data);
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