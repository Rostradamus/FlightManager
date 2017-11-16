function flightSearchHandler(res) {
    $("#medProtection").toggle();
    var fields = getFields(res);
    createIndentedColumns(fields);
    createFlightSearchData(res.body['result'], fields);
}

function seatSearchHandler(res) {
    var fields = getFields(res);
    createIndentedColumns(fields);
    createSeatSearchData(res.body['result'], fields);
}

function addBaggageHandler(res) {
    var fields = getFields(res);
    createBaggageColumns(fields);
    createBaggageData(res.body['result'], fields);
}

function getFields(res) {
    var fields = [];
    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    return fields
}

function createIndentedColumns(fields) {
    var fieldRow = $('<tr>');
    fieldRow.append($('<th>').text(""));

    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#flightSearchTable').append($('<thead>').append(fieldRow));
}

function createBaggageColumns(fields) {
    var fieldRow = $('<tr>');

    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    fieldRow.append($('<th>').text("Number of baggage"));
    $('#flightSearchTable').append($('<thead>').append(fieldRow));
}

function createFlightSearchData(results, fields) {
    results.forEach(function(result) {
        var fieldRow = $('<tr>');
        fieldRow.append($('<td> <input type="checkbox" onclick="getAvailableSeats(this)"> </td>'));
        fields.forEach(function(field) {
            var text = 'N/A';
            if (typeof result[field] !== 'undefined') {
                text = result[field];
            }
            fieldRow
                .append($('<td>')
                    .text(text))
        });
        $('#flightSearchTable').append($('<tbody>').append(fieldRow));
    });
}

function createSeatSearchData(results, fields) {
    results.forEach(function(result) {
        var fieldRow = $('<tr>');
        fieldRow.append($('<td> <input type="checkbox" onclick="getBaggageOptions(this)"> </td>'));
        fields.forEach(function(field) {
            var text = 'N/A';
            if (typeof result[field] !== 'undefined') {
                text = result[field];
            }
            fieldRow
                .append($('<td>')
                    .text(text))
        });
        $('#flightSearchTable').append($('<tbody>').append(fieldRow));
    });
}

function createBaggageData(results, fields) {
    var count = 0;
    results.forEach(function (result) {
        var fieldRow = $('<tr>');

        fields.forEach(function (field) {
            var text = 'N/A';
            if (typeof result[field] !== 'undefined') {
                text = result[field];
            }
            fieldRow
                .append($('<td>')
                    .text(text));
        });

        if (count++) {
            fieldRow.append($('<td> <input type="number" min="0" max="2" value="0" id="carryonNum"> </td>'));
        } else {
            fieldRow.append($('<td> <input type="number" min="0" max="2" value="0" id="checkedNum"> </td>'));
        }

        $('#flightSearchTable').append($('<tbody>').append(fieldRow));
    });
}

function addMedProtection() {
    reservation.medProtectionUsed = 1;
}

function getAvailableSeats(obj) {
    var selectedFlight = getDataInRow(obj);
    setFlightInfo(selectedFlight);

    $("#medProtection").hide();
    clearFlightSearchTable();

    var sql = getAvailableSeatsSQL(reservation.flightNum);
    postQuerySync({query: sql}, seatSearchHandler);
}

function setFlightInfo(selectedFlight) {
    reservation.flightNum = selectedFlight[1];
    reservation.dptCity = selectedFlight[4];
    reservation.arrCity = selectedFlight[8];
    reservation.dptDate = selectedFlight[6];
    reservation.dptTime = selectedFlight[7];
}

function getBaggageOptions(obj) {
    var selectedFlight = getDataInRow(obj);
    reservation.seatNum = selectedFlight[1];

    clearFlightSearchTable();
    $("#baggageOption").toggle();

    var sql = getBaggageFeeSQL();
    postQuerySync({query: sql}, addBaggageHandler);
}

function getDataInRow(obj) {
    var row = obj.parentNode.parentNode;
    var cols = row.getElementsByTagName("td");
    var data = [];

    for (var i = 0; i < cols.length; i++) {
        var val = cols[i].childNodes[0].nodeValue;
        if (val != null) {
            data.push(val);
        }
    }

    return data;
}

function setAndShowReservation() {
    addBaggageToReservation();
    setConfNum();
    setEmail();

    $("#flightSearchTable").hide();
    $("#baggageOption").hide();
    showReservationSummary();
}

function addBaggageToReservation() {
    reservation.carryonNum = $('#flightSearchTable').find("input[id='carryonNum']").val();
    reservation.checkedNum = $('#flightSearchTable').find("input[id='checkedNum']").val();
}

function setConfNum() {
    reservation.confNum = Math.floor(Math.random() * 1000000);
}

function setEmail() {
    reservation.email = window.sessionStorage.getItem("email");
}

function showReservationSummary() {
    setReservationTableValue();
    $("#reservationSummary").toggle();
}

function setReservationTableValue() {
    document.getElementById("rs-flightNum").innerHTML = reservation.flightNum;
    document.getElementById("rs-confNum").innerHTML = reservation.confNum;
    document.getElementById("rs-dptCity").innerHTML = reservation.dptCity;
    document.getElementById("rs-arrCity").innerHTML = reservation.arrCity;
    document.getElementById("rs-dptDate").innerHTML = reservation.dptDate;
    document.getElementById("rs-dptTime").innerHTML = reservation.dptTime;
    document.getElementById("rs-seatNum").innerHTML = reservation.seatNum;
    document.getElementById("rs-carryon").innerHTML = reservation.carryonNum;
    document.getElementById("rs-checked").innerHTML = reservation.checkedNum;
    document.getElementById("rs-cost").innerHTML = reservation.cost;
    showMedProtection();
}

function showMedProtection() {
    if (reservation.medProtectionUsed) {
        document.getElementById("rs-medProt").innerHTML = "selected";
    } else {
        document.getElementById("rs-medProt").innerHTML = "not selected";
    }
}

var defaultReservation = {
    flightNum: "",
    dptCity: "",
    arrCity: "",
    dptTime: "",
    dptDate: "",
    seatNum: "",
    confNum: -1,
    pointUsed: 0,
    medProtectionUsed: 0,
    email: "",
    carryonNum: 0,
    checkedNum: 0,
    cost: 0
};

var reservation = {
    flightNum: "",
    dptCity: "",
    arrCity: "",
    dptTime: "",
    dptDate: "",
    seatNum: "",
    confNum: -1,
    pointUsed: 0,
    medProtectionUsed: 0,
    email: "",
    carryonNum: 0,
    checkedNum: 0,
    cost: 0
};

function clearFlightSearchTable() {
    $('#flightSearchTable').text('');
}

function getFlightSearchSQL() {
    var $input = $('#flightSearch'),
        dptDate = $input.find("input[id='dptDate']").val(),
        arrCity = $input.find("input[id='arrCity']").val(),
        dptCity = $input.find("input[id='dptCity']").val();

    // For testing purpose
    var dptDate = "2017-12-21";
    var arrCity = "Vancouver";
    var dptCity = "Tokyo";

    return "select distinct f.flightNum, f.duration, f.miles," +
        " ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime," +
        " ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime" +
        " from flight f, departure d, arrival a, airport ap1, airport ap2" +
        " where ap1.acode = d.dptAirportCode and ap1.city = '" + dptCity + "' and d.dptDate = '" + dptDate +
        "' and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and" +
        " ap2.acode = a.arrAirportCode and ap2.city = '" + arrCity +
        "' and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid";
}

function getAvailableSeatsSQL(flightNum){
    return "select s.seatNum, st.stype, st.price" +
        " from Seat s, SeatType st, Airplane a, Flight f" +
        " where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = "
        + flightNum + " order by st.price";
}

function getBaggageFeeSQL(){
    return "select * from BaggageType";
}

function makeReservation(confnum, flightNum, cost, pointUsed, email){
    var sql = "insert into reservation" +
        " values("+ confnum + "," + cost + "," + pointUsed +"," + email + ")";

    postQuery({query: sql});

    sql = "insert into reserveFlight" +
        " values("+ confnum + "," + flightNum + ")";

    postQuery({query: sql});
}

function selectSeat(seatNum, confNum){
    return "update seat"+
        " set seat.isAvailable = 0 and seat.confNum = " + confNum +
        " where seat.seatNum = '" + seatNum + "'";
}

function updateSeat(confNum){
     // delete original seat
     var sql = "update reservation, seat" +
        " set seat.confNum = null and seat.isAvailable = 1" +
        " where reservation.confNum = seat.confNum and reservation.confNum = "+ confNum;

     postQuery({query: sql});

   // update seat
    sql = " update reservation, seat, seattype" +
        " set reservation.cost = seattype.cost and seat.seatNum = 0 and seat.confNum = "+ confNum +""+
        " where seat.type = seattype.seattype";

    postQuery({query: sql});
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

function passengerCheckTotalCost (email){
    return "select sum(cost)" +
            " from Reservation r" +
            " group by " + email + "";
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