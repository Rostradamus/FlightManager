var medProtFee = 50;
var pointRate = 100;
var defaultReservation = {
    flightNum: "",
    dptCity: "",
    arrCity: "",
    dptTime: "",
    dptDate: "",
    seatNum: "",
    seatPrice: 0,
    confNum: -1,
    pointUsed: 0,
    medProtectionUsed: 0,
    email: "",
    carryonNum: 0,
    checkedNum: 0,
    checkedFee: 0,
    cost: 0,
    finalCost: 0,
    point: 0,
    pid: 0
};

var reservation = {
    flightNum: "",
    dptCity: "",
    arrCity: "",
    dptTime: "",
    dptDate: "",
    seatNum: "",
    seatPrice: 0,
    confNum: -1,
    pointUsed: 0,
    medProtectionUsed: 0,
    email: "",
    carryonNum: 0,
    checkedNum: 0,
    checkedFee: 0,
    cost: 0,
    finalCost: 0,
    point: 0,
    pid: 0
};

// Flight Search: send flight SQL, retrieve data, put data into table and set flight info to reservation object

function searchForFlight() {
    var sql = getFlightSearchSQL();
    postQuery({query: sql}, flightSearchHandler);
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

function flightSearchHandler(res) {
    $("#medProtection").toggle();
    var fields = getFieldNames(res);
    createIndentedColumns(fields);
    createFlightSearchData(res.body['result'], fields);
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

function createFlightSearchData(results, fields) {
    results.forEach(function(result) {
        var fieldRow = $('<tr>');
        fieldRow.append($('<td> <input type="checkbox" onclick="setFlightAndGetSeats(this)"> </td>'));
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

function setFlightAndGetSeats(obj) {
    var selectedFlight = getDataInRow(obj);
    setFlightInfo(selectedFlight);

    $("#medProtection").hide();
    clearFlightSearchTable();
    searchForSeats();
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

function clearFlightSearchTable() {
    $('#flightSearchTable').text('');
}

function setFlightInfo(selectedFlight) {
    reservation.flightNum = selectedFlight[1];
    reservation.dptCity = selectedFlight[4];
    reservation.arrCity = selectedFlight[8];
    reservation.dptDate = selectedFlight[6];
    reservation.dptTime = selectedFlight[7];
    setPidFromFlight(reservation.flightNum);
}

function setPidFromFlight(flightNum) {
    var sql = "select pid from flight f where f.flightNum = " + flightNum;
    postQuerySync({query: sql}, flightPidHandler);
}

function flightPidHandler(res) {
    var result = res.body['result'][0];
    reservation.pid = result["pid"];
}

// Medical Protection Selection: set medProtectionUsed flag in reservation object

function addMedProtection() {
    reservation.medProtectionUsed = !reservation.medProtectionUsed;
}

// Seat Selection: send seat SQL, retrieve data, put data into table and set seat info to reservation object

function searchForSeats() {
    var sql = getAvailableSeatsSQL(reservation.flightNum);
    postQuerySync({query: sql}, seatSearchHandler);
}

function getAvailableSeatsSQL(flightNum){
    return "select s.seatNum, st.stype, st.price" +
        " from Seat s, SeatType st, Airplane a, Flight f" +
        " where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = "
        + flightNum + " order by st.price";
}

function seatSearchHandler(res) {
    var fields = getFieldNames(res);
    createIndentedColumns(fields);
    createSeatSearchData(res.body['result'], fields);
}

function createSeatSearchData(results, fields) {
    results.forEach(function(result) {
        var fieldRow = $('<tr>');
        fieldRow.append($('<td> <input type="checkbox" onclick="setSeatAndGetBaggageOptions(this)"> </td>'));
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

function setSeatAndGetBaggageOptions(obj) {
    setSelectedSeat(obj);

    clearFlightSearchTable();
    $("#baggageOption").toggle();

    getBaggageOptions();
}

function setSelectedSeat(obj) {
    var selectedFlight = getDataInRow(obj);
    reservation.seatNum = selectedFlight[1];
    reservation.seatPrice = selectedFlight[3];
}

// Add Baggage: send baggage type SQL, retrieve data, and put data into table for user to input their baggage(s)

function getBaggageOptions() {
    var sql = getBaggageFeeSQL();
    postQuerySync({query: sql}, addBaggageHandler);
}

function getBaggageFeeSQL(){
    return "select * from baggageType";
}

function addBaggageHandler(res) {
    var fields = getFieldNames(res);
    createBaggageColumns(fields);
    createBaggageData(res.body['result'], fields);
}

function getFieldNames(res) {
    var fields = [];
    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    return fields
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

function createBaggageData(results, fields) {
    var count = 0;
    results.forEach(function (result) {
        var fieldRow = $('<tr>');

        fields.forEach(function (field) {
            var text = 'N/A';
            if (typeof result[field] !== 'undefined') {
                text = result[field];
            }

            if (field === "fee" && result[field] !== 0) {
                reservation.checkedFee = result[field];
            }

            fieldRow
                .append($('<td>')
                    .text(text));
        });

        addBaggageInput(count++, fieldRow);
        $('#flightSearchTable').append($('<tbody>').append(fieldRow));
    });
}

function addBaggageInput(count, fieldRow) {
    if (count) {
        fieldRow.append($('<td> <input type="number" min="0" max="2" value="0" id="checkedNum"> </td>'));
    } else {
        fieldRow.append($('<td> <input type="number" min="0" max="1" value="0" id="carryonNum"> </td>'));
    }
}

// Reservation Summary: set baggage, confirmation number, email, total cost into reservation object.

function setAndShowReservation() {
    addBaggageToReservation();
    setConfNum();
    setEmail();
    setTotalCost();
    validateMileageMember();

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

function setTotalCost() {
    reservation.cost = Number(reservation.seatPrice);
    reservation.cost += Number(reservation.checkedFee * reservation.checkedNum);

    if (reservation.medProtectionUsed) {
        reservation.cost += Number(medProtFee);
    }

    reservation.finalCost = reservation.cost;
}

// Mileage Member Point Option: if user is a mileage member, show option to use their mileage point
// with their current point, final cost after point saving, and their remaining point after deduction.

function validateMileageMember() {
    var sql = getMileageMemberSQL();
    postQuery({query: sql}, mileageMemberHandler);
}

function getMileageMemberSQL(){
    return "select mpoint from mileagemember where email = '" + reservation.email + "'";
}

function mileageMemberHandler(res) {
    var result = res.body['result'][0];
    var point = result["mpoint"];

    if (typeof point === 'undefined') {
        reservation.point = -1;
        return;
    }

    showPointOption(point);
}

function showPointOption(point) {
    reservation.point = point;
    var finalSaving = getSavingFromPoint(point);
    var updatedPoint = getUpdatedPoint(finalSaving);

    $("#usePoint"+"+span").html(" You have " + point + " points. You can save $" + finalSaving +
        " on this trip and your remaining point will be " + updatedPoint + ".");
    $("#usePoint").toggle();
}

function getSavingFromPoint(point) {
    var conversedPoint = Number(point) / Number(pointRate);
    return Math.min(conversedPoint, reservation.cost);
}

function getUpdatedPoint(finalSaving) {
    return Math.round(Number(reservation.point) - (Number(finalSaving) * Number(pointRate)));
}

// Mileage Member Point Option Selected: update and display updated final cost of the trip

function updateTotalCost() {
    reservation.pointUsed = !reservation.pointUsed;

    if (reservation.pointUsed) {
        var finalSaving = getSavingFromPoint(reservation.point);
        reservation.finalCost -= Number(finalSaving);
        setReservationTableValue();
    } else {
        reservation.finalCost = reservation.cost;
        setReservationTableValue();
    }
}

// Display reservation summary

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
    document.getElementById("rs-cost").innerHTML = "$" + reservation.finalCost;
    showMedProtection();
}

function showMedProtection() {
    if (reservation.medProtectionUsed) {
        document.getElementById("rs-medProt").innerHTML = "selected";
    } else {
        document.getElementById("rs-medProt").innerHTML = "not selected";
    }
}

// Making Reservation

function makeReservation() {
    insertReservation(reservation.confNum, reservation.flightNum, reservation.finalCost,
        reservation.pointUsed, reservation.medProtectionUsed, reservation.email);
    addBaggages(reservation.pid, reservation.confNum);
    setMileagePoint();
    selectSeat(reservation.seatNum, reservation.confNum, reservation.pid);

    if (reservation.checkedNum > 0 || reservation.carryonNum > 0) {
        retrieveBaggageTag(reservation.pid, reservation.confNum);
    }

    $('#reservationButtons').hide();
    $('#reservationCompleted').toggle();
}

// insert reservation into DB

function insertReservation(confNum, flightNum, cost, pointUsed, medProtUsed, email){
    var sql = "insert into reservation values(" + confNum + "," + cost + "," + pointUsed + ","
        + medProtUsed + ",'" + email + "')";

    postQuerySync({query: sql});
    sql = "insert into reserveFlight values(" + confNum + "," + flightNum + ")";
    postQuerySync({query: sql});
}

// insert baggage(s) to DB

function addBaggages(pid, confNum) {
    var checkedBag = reservation.checkedNum;
    var carryonBag = reservation.carryonNum;

    for (var i = 0; i < checkedBag; i++) {
        addBaggageTag("checked", pid, confNum);
    }

    for (var i = 0; i < carryonBag; i++) {
        addBaggageTag("carry-on", pid, confNum);
    }
}

function getRandomBaggageTag () {
    return Math.floor(Math.random() * 10000000000).toString();
}

function addBaggageTag(baggageType, pid, confNum) {
    var tag = getRandomBaggageTag();
    var sql = "insert into baggage values('" + tag + "','" + baggageType + "'," + pid + "," + confNum + ")";
    postQuerySync({query: sql});
}

// Update mileage point for mileage member to DB

function setMileagePoint() {
    // deduct mileage point only if it's used to pay for this trip
    if (reservation.pointUsed) {
        var finalSaving = getSavingFromPoint(reservation.point);
        reservation.point = getUpdatedPoint(finalSaving);
    }

    // add and update mileage point for this trip
    if (reservation.point !== -1) {
        updateMileagePoint(Number(reservation.point) + Number(reservation.finalCost));
    }
}

function updateMileagePoint(updatedPoint){
    var sql = "update mileagemember m" +
        " set m.mpoint = " + updatedPoint + " where m.email = '" + reservation.email + "'";

    postQuerySync({query: sql});
}

// Update seat selection to DB

function selectSeat(seatNum, confNum, pid){
    var sql = "update seat"+
        " set seat.isAvailable = 0, seat.confNum = " + confNum +
        " where seat.pid = " + pid + " and seat.seatNum = '" + seatNum + "'";

    postQuerySync({query: sql});
}

// Display tagged baggages

function retrieveBaggageTag(pid, confNum) {
    var sql = "select b.btype as Baggage, b.tag from baggage b where b.pid = " + pid + " and b.confNum = " + confNum;
    postQuery({query: sql}, baggageTagHandler);
}

function baggageTagHandler(res) {
    var fields = getFieldNames(res);
    $('#baggageTagged').toggle();
    createTableColumns(fields);
    createBaggageTagData(res.body['result'], fields);
}

function createTableColumns(fields) {
    var fieldRow = $('<tr>');

    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#taggedBaggageTable').append($('<thead>').append(fieldRow));
}

function createBaggageTagData(results, fields) {
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
        $('#taggedBaggageTable').append($('<tbody>').append(fieldRow));
    });
}