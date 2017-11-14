function loginHandler(res) {
    if (res.body.length === 0) {
        $('#loginMsg').text("User does NOT exist");
        return;
    }
    var email = $('#loginForm').find("input[name='uname']").val(),
        password = $('#loginForm').find("input[name='psw']").val();
    if(res.body[0].password !== password) {
        $('#loginMsg').text("Password does NOT match");
        return;
    }
    console.log("Password matches!");
    createSession(email, password);
    window.location.href = './';
}

function createSession(email, password) {
    var session = window.sessionStorage;
    if (typeof(session) !== "undefined") {
        session.setItem('email', email);
        session.setItem('password', password);
        session.setItem('isLoggedIn', true);
    }
    else {

    }
}

// NOTE: There is no serious encryption in this application since it's NOT required
$(document).ready(function () {
    var isLoggedIn = JSON.parse(window.sessionStorage.getItem('isLoggedIn'));
    if (isLoggedIn) window.location.href = './';
    $('#loginForm').submit(function(event) {
        $('#loginMsg').text('');
        event.preventDefault();
        var $form = $('#loginForm'),
            username = $form.find("input[name='uname']").val(),
            sql = "select password from passenger where email=" + JSON.stringify(username),
            info = {query: sql};
        $.ajax({
            type: 'POST',
            url: './login',
            data: JSON.stringify(info),
            contentType: "application/json; charset=utf-8",
            success: loginHandler
        })
    });
});