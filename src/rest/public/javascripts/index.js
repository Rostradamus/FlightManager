function postQuery(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        success: handler
    })
}

function postQuerySync(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        success: handler,
        async: false
    })
}

// Dropdown Menu Handlers

// function onClickUpdateProfile() {
//     var email = window.sessionStorage.getItem("email"),
//         sql = "select * from passenger where email=" + JSON.stringify(email);
//     console.log(sql);
//     loadBlockContent('./profile', sql);
// }

function loadBlockContent(url) {
    $('.container').load(url);
}

$(document).ready(function () {

    if (!$.trim($('.container').html()).length) {
        $('.container').load('./home');
    }
    clearFlightSearchTable();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn')),
        usertype = session.getItem('usertype');
    $('.not-logged-in, .common-menu, .passenger-menu, .pilot-attendant-menu, .clerk-menu, .employee-menu')
        .css("display", "none");


    if (isLoggedIn)
        $('.common-menu')
            .css("display", "inline");
    else
        $('.not-logged-in')
            .css("display", "inline");


    if (usertype === "passenger")
        $('.passenger-menu')
            .css("display", "inline");
    else {
        $('.employee-menu')
            .css("display", "inline");
        if (usertype === "airlineClerk") {
            $('.clerk-menu')
                .css("display", "inline");
        }
        else
            $('.pilot-attendant-menu')
                .css("display", "inline");
    }

    $(document).on("click", "#clearTable", function () {
        clearFlightSearchTable();
    });

    $(document).on("click", "#submitQuery", function () {
        clearFlightSearchTable();
        if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
            loadBlockContent('./login');
            return;
        }

        var sql = getFlightSearchSQL();
        postQuery({query: sql}, flightSearchHandler);
    });

    $(document).on("click", "#addBaggage", function () {
        setAndShowReservation();
    });

    $(document).on("click", "#makeReservation", function () {

    });

    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});