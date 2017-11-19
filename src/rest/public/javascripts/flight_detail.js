function contentsHandler1(res, $target) {
    function createColumns(fields) {
        var fieldRow = $('<tr>');
        fields.forEach(function (field) {
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
        results.forEach(function (result) {
            var fieldRow = $('<tr>');
            fields.forEach(function (field) {
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
    $target.show();
}

function contentsHandler2(res, $target, type) {
    function createColumns(fields) {
        var fieldRow = $('<tr>');
        fieldRow.append($('<th>'));
        fields.forEach(function (field) {
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
        results.forEach(function (result) {
            var fieldRow = $('<tr>');
            fieldRow
                .append($('<td>')
                    .append($('<button>')
                        .attr("type", "button")
                        .attr("id", result["ID"])
                        .attr("class", "switch-button btn btn-primary btn-xs")
                        .text("assign")
                        .click(function () {
                            assign(result["ID"], type)
                        })));

            fields.forEach(function (field) {
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
    $target.show();
}

function fillTableWithButton(sql, $target, type) {
    if ($target.text() !== "")
        $target.hide(function () {
            $target.text("");
            postQuerySync({query: sql}, function (res) {
                contentsHandler2(res, $target, type);
            })
        });
    else
        postQuerySync({query: sql}, function (res) {
            contentsHandler2(res, $target, type);
        })
}

function fillTable(sql, $target) {
    if ($target.text() !== "")
        $target.hide(function () {
            $target.text("");
            postQuerySync({query: sql}, function (res) {
                contentsHandler1(res, $target);
            })
        });
    else
        postQuerySync({query: sql}, function (res) {
            contentsHandler1(res, $target);
        })
}

function showGateTable() {
    $('#updateGateTable').toggle();
}

function updateGate() {
    var terminal = $("#terminalSelector").val(),
        gate = $("#gateCSelector").val() + $("#gateNumSelector").val(),
        flightNum = $("#flightNum").text();
    var sql = "update departure d, flight f" +
        " set terminal = " + JSON.stringify(terminal) + ", gate = " + JSON.stringify(gate) +
        " where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and flightNum = " + flightNum;
    postQuerySync({query: sql}, function (res) {
        if (res.code === 200) {
            var sql = "select d.dptDate as Date, d.dptTime as Time, ap.acode as AirportCode," +
                " aname as Airport, City, Country, terminal, gate from flight f, departure d, airport ap " +
                "where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap.acode = d.dptAirportCode and flightNum = " + flightNum;
            fillTable(sql, $('#dptTable'));
        }
        else
            alert("Update failed");
    });
}

function assign(eid, type) {
    var flightNum = $("#flightNum").text(),
        sql = "insert into flightCrewAssignment(eid, flightNum) values (" + eid + "," + flightNum + ")";

    postQuerySync({query: sql}, function (res) {
        if (res.code === 200) {
            var sql;
            if (type === "pilot") {
                sql = "select eid as ID, ename as Name, email as Email, age as Age, lastFlydate as LastFlyDate, " +
                    "medCertExpDate as MedCertificateExpiryDate, SIN " +
                    "from flight f natural join FlightCrewAssignment fc natural join employee e natural join pilot p " +
                    "where flightNum = " + flightNum;
                fillTable(sql, $('#pilotTable'));
                $('#availablePilot').hide();
            }
            else if (type === "flightAttendant") {
                sql = "select eid as ID, ename as Name, email as Email, age as Age, flyRestriction as FlyRestriction, SIN " +
                    "from flight f natural join FlightCrewAssignment fc natural join employee e natural join flightAttendant fa " +
                    "where flightNum = " + flightNum;
                fillTable(sql, $('#faTable'));
                $('#availableAttendant').hide();
            }
        }
        else
            alert("Assign failed");
    })
}

function viewAvailablePilot() {
    if ($('#availablePilot').text() !== "")
        return $("#availablePilot").toggle();


    var dptDate = document.getElementById("dptTable").rows[1].cells[0].innerHTML,
        arrivalDate = document.getElementById("arrTable").rows[1].cells[0].innerHTML,
        lastFlyDateLimit, sql;
    lastFlyDateLimit = new Date(arrivalDate);
    lastFlyDateLimit.setFullYear(lastFlyDateLimit.getFullYear() - 1);
    console.log(lastFlyDateLimit.toISOString().split("T")[0]);
    sql = "select ename as Name, age as Age, eid as ID, email as Email, lastFlyDate, medCertExpDate" +
        " from pilot natural join employee" +
        " where lastFlyDate >= " + JSON.stringify(lastFlyDateLimit.toISOString().split("T")[0]) +
        " and medCertExpDate >= " + JSON.stringify(arrivalDate) +
        " and eid not in" +
        " (select distinct eid from flightCrewAssignment natural join flight" +
        " where arrDate >= " + JSON.stringify(dptDate) + " and dptDate <= " + JSON.stringify(arrivalDate) +
        ") order by lastFlyDate";
    fillTableWithButton(sql, $("#availablePilot"), "pilot");
}

function viewAvailableAttendant() {
    if ($('#availableAttendant').text() !== "")
        return $("#availableAttendant").toggle();
    var dptDate = document.getElementById("dptTable").rows[1].cells[0].innerHTML,
        arrivalDate = document.getElementById("arrTable").rows[1].cells[0].innerHTML,
        dptCountry = document.getElementById("dptTable").rows[1].cells[5].innerHTML,
        arrCountry = document.getElementById("arrTable").rows[1].cells[5].innerHTML,
        sql = "select ename as Name, age as Age, eid as ID, email as Email" +
            " from flightAttendant natural join employee" +
            " where eid not in" +
            " (select distinct eid from flightCrewAssignment natural join flight" +
            " where arrDate >= " + JSON.stringify(dptDate) + " and dptDate <= " + JSON.stringify(arrivalDate) + ")";
    if (dptCountry !== arrCountry)
        sql += " and flyrestriction = 0";
    fillTableWithButton(sql, $("#availableAttendant"), "flightAttendant");
}

function viewPassenger() {
    if ($('#passengerTable').text() !== "")
        return $("#passengerTable").toggle();
    var flightNum = $("#flightNum").text(),
        sql = "select confNum as Configuration, email as Email, pname as Name, phone as Phone, address As Address" +
            " from flight f natural join reserveFlight rf natural join reservation r natural join passenger p" +
            " where flightNum = " + flightNum;
    fillTable(sql, $("#passengerTable"));
}

function getFlightInfo(flightNum) {
    var sql = "select * from flight";
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
