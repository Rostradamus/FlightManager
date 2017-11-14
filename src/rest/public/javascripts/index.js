



function postQuery(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        success: handler
    })
}

function contentsHandler(res) {
    var fields = getFields(res);

    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    createColumns(fields);
    createData(res.body['result'], fields);
}

function getFields(res) {
    var fields = [];
    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    return fields
}

function createColumns(fields) {
    var fieldRow = $('<tr>');
    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#resTable').append($('<thead>').append(fieldRow));
}

function createData(results, fields) {
    results.forEach(function(result) {
        var fieldRow = $('<tr>');
        fields.forEach(function(field) {
            var text = 'N/A';
            if (typeof result[field] !== 'undefined') {
                text = result[field];
            }
            fieldRow
                .append($('<td>')
                    .text(text))
        });
        $('#resTable').append($('<tbody>').append(fieldRow));
    });
}



function clearResult() {
    $('#resTable').text('');
}

function getFlightSearchSQL() {
    var $input = $('#flightSearch'),
        dptDate = $input.find("input[id='dptDate']").val(),
        arrCity = $input.find("input[id='arrCity']").val(),
        dptCity = $input.find("input[id='dptCity']").val();

    // For testing purpose
    // var dptDate = "2017-12-21";
    // var arrCity = "Vancouver";
    // var dptCity = "Tokyo";

    return "select distinct f.flightNum, f.duration, f.miles," +
        " ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime," +
        " ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime" +
        " from flight f, departure d, arrival a, airport ap1, airport ap2" +
        " where ap1.acode = d.dptAirportCode and ap1.city = '" + dptCity + "' and d.dptDate = '" + dptDate +
        "' and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and" +
        " ap2.acode = a.arrAirportCode and ap2.city = '" + arrCity +
        "' and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid";
}

function viewAvailableSeats(){
    //TODO: need to fix
    var $input = $('#availableSeats'),
        flightNum = $input.find("input[id='flightNum']").val();


    return "select st.price, st.stype, s.seatNum"+
        " from Seat s, SeatType st, Airplane a, Flight f" +
        " where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = "+ flightNum;

}



function selectSeat(seatNum){

    return "update seat"+
        " set seat.isAvailable = 0"+
        " where seat.seatNum = "+seatNum+"";

}


// function updateSeat(confNum){
//     //TODO: view available seats from function selectSeat: assumed the confirmation number stays the same
//
//
//     // delete original seat
//      "update reservation, seat"+
//         " set seat.confNum = null and seat.isAvailable = 1"+
//         " where reservation.confNum = seat.confNum and reservation.confNum = "+ confNum +"";
//
//    // update seat
//     " update reservation, seat, seattype" +
//     " set reservation.cost = seattype.cost and seat.seatNum = 0 and seat.confNum = "+ confNum +""+
//         " where seat.type = seattype.seattype";
// }


function viewBaggageFee(){

    return "select * from BaggageType";
}

function checkBaggageCarouselNumber(flightnum){

    return "select a.carousel"+
            " from Flight f, Arrival a"+
            " where f.arrDate = a.arrDate and f.arrFSid = a.arrFSid and"+
            " f.flightNum = "+ flightnum + "";
}


function checkNumSeats(dptDate, dptTime){

     return "select s.type as type, count(*) as count" +
        " from flight f, airplane a, departure d, seat s" +
        " where f.pid = a.pid and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and" +
        " d.dptDate = "+ dptDate + " and d.dptTime = "+ dptTime + " and s.isAvailable = 1" +
        " group by s.stype";

}

function makeReservation(confnum, cost, pointUsed, email){

    return "insert into reservation" +
            " values("+ confnum + "," + cost + "," + pointUsed +"," + email + ")";
}

function passengerCheckTotalCost (email){
    return "select sum(cost)" +
            " from Reservation r" +
            " group by " + email + "";
}

function airlineClerkView (){

    return "create view as airline_view(id, name, email, address, age, sin) as" +
        " select eid, ename, email, address, age, sin" +
        " from employee";
}

function flightAttendantView(){

    return "create view as flightatt_view(name, email) as" +
        " select e.ename, e.email" +
        " from Employee e, FlightAttendant f" +
        " where e.eid = f.eid";
}

function pilotView(){
    return "create view as pilot_view(name,email) as" +
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

function onClickUpdateProfile() {
    var email = window.sessionStorage.getItem("email"),
        sql = "select * from passenger where email=" + JSON.stringify(email);
    console.log(sql);
    loadBlockContent('./profile', sql);
}

function loadBlockContent(url) {
    $('.container').load(url);
}



$(document).ready(function () {
    clearResult();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));


    if (isLoggedIn) {

        $('#signup')
            .css("display", "none");
        $('#login')
            .css("display", "none");
        $('#logout')
            .css("display", "inline");
        $('.dropdown')
            .css("display", "inline");

    }
    else {
        $('#signup')
            .css("display", "inline");
        $('#login')
            .css("display", "inline");

        $('#logout')
            .css("display", "none");
        $('.dropdown')
            .css("display", "none");

    }

    // var call = function(id){
    //     var x = document.getElementById(id).value;
    //     alert(x);
    // }

    $(document).on("click", "#clearTable", function () {
        clearResult();
    });

    $(document).on("click", "#submitQuery", function () {
        clearResult();
        if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
            loadBlockContent('./login');
            return;
        }

        var sql = getFlightSearchSQL();

        postQuery({query: sql}, contentsHandler);
    });

    $(document).on("click", "#availSeats", function () {
        clearResult();
        if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
            window.location.href = './login';
            return;
        }

        var sql = viewAvailableSeats();
        clearResult();
        postQuery({query: sql}, contentsHandler);
    });



    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});