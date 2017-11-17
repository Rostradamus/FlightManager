var $input = $('#flightSearch'),
    dptCity = $input.find("input[id='dptCity']").val(),
    arrCity = $input.find("input[id='arrCity']").val(),
    dptDateFrom = $input.find("input[id='dptDateFrom']").val(),
    dptDateTo = $input.find("input[id='dptDateTo']").val(),
    isCrewNull = $input.find("input[id='isCrewNull']").is(":checked");
// var where = "where ap1.acode = d.dptAirportCode and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid " +
//     "and ap2.acode = a.arrAirportCode and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid and " +
//     "f.pid = p.pid and s.pid = p.pid and s.isAvailable=1";
var where = "where ap1.acode = d.dptAirportCode and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid " +
    "and ap2.acode = a.arrAirportCode and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid";

if (dptCity !== "")
    where += " and ap1.city = " + JSON.stringify(dptCity);
if (arrCity !== "")
    where += " and ap2.city = " + JSON.stringify(arrCity);
if (dptDateFrom !== "")
    where += " and d.dptDate >= " + JSON.stringify(dptDateFrom);
if (dptDateTo !== "")
    where += " and d.dptDate <= " + JSON.stringify(dptDateTo);
if (isCrewNull)
    where += " and f.flightNum not in (select flightNum from flightCrewAssignment)";
// var sql = "select distinct f.flightNum, f.duration, f.miles," +
//     " ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime," +
//     " ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime, COUNT(s.seatNum) as AvailableSeat" +
//     " from flight f, departure d, arrival a, airport ap1, airport ap2, seat s, airplane p, seatType st " + where +
//     " group by f.flightNum";

var sql = "(select distinct f.flightNum, f.duration, f.miles, f.pid," +
    " ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime," +
    " ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime" +
    " from flight f, departure d, arrival a, airport ap1, airport ap2 " + where + " ) as temp";
sql = "select flightNum, duration, miles, dptCity, dptAirport, dptDate, dptTime, " +
    "arrCity, arrAirport, arrTime, COUNT(seatNum) as availableSeat from "
    + sql + " natural join airplane natural join seat where isAvailable = 1 group by flightNum";

function contentsHandler1(res, $target) {
    function createColumns(fields) {
        var fieldRow = $('<tr>');
        fields.forEach(function(field) {
            fieldRow
                .append($('<th>')
                    .text(field))
        });
        fieldRow
            .append($('<th>')
                .text(''));


        $target.append($('<thead>').append(fieldRow));
    }

    function createData(results, fields) {
        var tbody = $('<tbody>');
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
            tbody.append(fieldRow);
        });
        $target.append(tbody);
    }
    var fields = getFields(res);

    createColumns(fields);
    createData(res.body['result'], fields);
}

function fillTable(sql, $target) {
    postQuerySync({query: sql}, function(res) {
        contentsHandler1(res, $target);
    })
}

function showGateTable() {
    $('#updateGateTable').css("display", "inline");
    for (var i = 65; i < 75; i++) {
        $("#gateCSelector")
            .append($('<option>')
                .val(String.fromCharCode(i))
                .text(String.fromCharCode(i)))
    }
    for (var i = 1; i < 20; i++) {
        $("#gateNumSelector")
            .append($('<option>')
                .val(i)
                .text(i))
    }
}

function updateGate() {
    var terminal = $("#terminalSelector").val(),
        gate = $("#gateCSelector").val() + $("#gateNumSelector").val(),
        flightNum = $("#flightNum").text();
    var sql = "update departure d, flight f" +
        " set terminal = " + JSON.stringify(terminal) + ", gate = " + JSON.stringify(gate) +
        " where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and flightNum = " + flightNum;
    postQuerySync({query:sql}, function (res) {
        if (res.code === 200)
            createFlightDetail(flightNum);
        else
            alert("Update failed");
    });

}

function showAvailableEmployee(type) {
}

function assignPilot() {

}

function assignAttendant() {

}

function viewPassenger() {
    var flightNum = $("#flightNum").text(),
        sql = "select confNum as Configuration, email as Email, pname as Name, phone as Phone, address As Address" +
            " from flight f natural join reserveFlight rf natural join reservation r natural join passenger p" +
            " where flightNum = " + flightNum;
    fillTable(sql, $("#passengerTable"));
}

function getFlightInfo(flightNum) {
    var sql = "select * from flight";
    postQuerySync({query: sql}, function (res) {
        var data = res.body.result[0];
        $("#duration").text(data["duration"] + " hour(s)");
        $("#distance").text(data["miles"] + " mile(s)");
    });
    sql = "select ap.pcode as Code, ap.ptype as Type from flight f, airplane ap where f.pid = ap.pid and flightNum = " + flightNum;
    fillTable(sql, $('#apTable'));
    sql = "select d.dptDate as Date, d.dptTime as Time, ap.acode as AirportCode," +
        " aname as Airport, City, Country, terminal, gate from flight f, departure d, airport ap " +
        "where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap.acode = d.dptAirportCode and flightNum = " + flightNum;
    fillTable(sql, $('#dptTable'));
    sql = "select a.arrDate as Date, a.arrTime as Time, ap.acode as AirportCode," +
        " aname as Airport, City, Country, Carousel from flight f, arrival a, airport ap " +
        "where a.arrDate = f.arrDate and a.arrFSid = f.arrFSid and ap.acode = a.arrAirportCode and flightNum = " + flightNum;
    fillTable(sql, $('#arrTable'));
    sql = "select stype as Type, COUNT(seatNum) as Available " +
        "from flight f natural join airplane p natural join seat s natural join seatType st " +
        "where isAvailable=1 and flightNum = " + flightNum + " group by flightNum, stype";
    fillTable(sql, $('#seatTable'));

    sql = "select eid as ID, ename as Name, email as Email, age as Age, lastFlydate as LastFlyDate, " +
        "medCertExpDate as MedCertificateExpiryDate, SIN " +
        "from flight f natural join FlightCrewAssignment fc natural join employee e natural join pilot p " +
        "where flightNum = " + flightNum;
    fillTable(sql, $('#pilotTable'));

    sql = "select eid as ID, ename as Name, email as Email, age as Age, flyRestriction as FlyRestriction, SIN " +
        "from flight f natural join FlightCrewAssignment fc natural join employee e natural join flightAttendant fa " +
        "where flightNum = " + flightNum;
    fillTable(sql, $('#faTable'));
}
