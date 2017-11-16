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

function airlineClerkView (){
    return "create view airline_view(id, name, email, address, age, sin) as" +
        " select eid, ename, email, address, age, sin" +
        " from employee";
}

function flightAttendantView(){
    return "create view flightatt_view(name, email) as" +
        " select e.ename, e.email" +
        " from Employee e, FlightAttendant f" +
        " where e.eid = f.eid";
}

function pilotView(){
    return "create view pilot_view(name,email) as" +
        " select e.ename, e.email" +
        " from Employee e, Pilot p" +
        " where e.eid = p.eid";
}

function employeeViewOwnFightSchedule(eid){
    return "select e.ename as name, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber" +
        " from employee e natural join flightcrewassignment l natural join flight f natural join departure d natural join airplane a" +
        " where e.eid = " +eid+ "";
}

function employeeViewAllFlightSchedule(date, time){
    return "select e.eid as id, e.ename as name, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber" +
        " from employee e natural join flightcrewassignment l natural join flight f natural join departure d natural join airplane a" +
        " where d.dptDate = "+date+" and d.dptTime = "+time+"";


}

function checkReservation(confnum){
    return "select r.confNum, rf.flightNum, s.seatNum, b.tag" +
        "from Reservation r, Seat s, ReserveFlight rf, Baggage b" +
        "where r.confNum = "+confnum+ " and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum";
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
        reservation = defaultReservation;
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

    $(document).on("click", "#cancelReservation", function () {
        reservation = defaultReservation;
        loadBlockContent('./home');
    });

    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});