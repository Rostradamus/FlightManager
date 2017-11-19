function getReservation(email) {

    var $input = $('#reservationSearch');
    return "select distinct r.confNum as ConfirmationID, rf.flightNum as Flight, s.seatNum as Seat, ar.carousel as BaggageCarousel, b.tag as BaggageTag, f.dptDate as Date, d.gate as Gate" +
        " from Reservation r, Seat s, ReserveFlight rf, Baggage b, Flight f, Airplane a, Departure d, Arrival ar" +
        " where r.email = '" + email + "' and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum and rf.flightNum = f.flightNum and" +
        " d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ar.arrDate = f.arrDate and ar.arrFSid = f.arrFSid";
}



function getOldSeatPrice(oldSeatNum) {
    return "create or replace view oldseatprice (price, type) as" +
        " select st.price, st.stype" +
        " from Seat s, SeatType st" +
        " where s.stype = st.stype and s.seatNum = '" + oldSeatNum + "'";
}


function dropOldSeatPriceView() {
    return "drop view if exists oldseatprice";
}

function viewAvailableSeats(flightNum) {

    return "select st.price as Price, st.stype as Type, s.seatNum" +
        " from Seat s, SeatType st, Airplane a, Flight f" +
        " where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = " + flightNum + "";

}

function deleteOldSeat(confNum) {
    return "update reservation, seat" +
        " set seat.confNum = null, seat.isAvailable = 1" +
        " where reservation.confNum = seat.confNum and reservation.confNum = " + confNum + "";

}


function updateNewSeat(confNum, seatNum, flightNum) {

    return "update reservation, seat, seattype, flight, oldseatprice" +
        " set seat.isAvailable = 0, seat.confNum = " + confNum + "" +
        " where seat.stype = seattype.stype and flight.flightNum = " + flightNum + " and reservation.confNum = " + confNum + " and flight.pid = seat.pid and seat.seatNum = '" + seatNum + "'";
}


function updatePrice(confNum, seatNum, flightNum) {

    return "update reservation, seat, seattype, flight, oldseatprice" +
        " set reservation.cost = case when seattype.price > oldseatprice.price then reservation.cost - oldseatprice.price + seattype.price else reservation.cost end" +
        " where seat.stype = seattype.stype and flight.flightNum = " + flightNum + " and reservation.confNum = " + confNum + " and flight.pid = seat.pid and seat.seatNum = '" + seatNum + "'";
}

function passengerCheckTotalCost(email) {

    return "select sum(cost)" +
        " from Reservation r" +
        " where r.email = '" + email + "'" +
        " group by r.email";
}

function resgetFields(res) {
    var fields = [];
    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    return fields
}

function rescreateColumns(fields) {
    var fieldRow = $('<tr>');
    fieldRow.append($('<th>').text(""));
    fields.forEach(function (field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });
    $('#seatTable').append($('<thead>').append(fieldRow));
}

function clearResult() {
    $('#seatTable').text('');

}

function reservationHandler(res) {


    function createData(results, fields) {

        var index = 1;
        var tbody = $('<tbody>');
        results.forEach(function (result) {
            var fieldRow = $('<tr>');

            fieldRow.append($('<td>').append($('<button type="button" class="reserve-buttons btn btn-primary btn-xs" id="' + index + '">ReSelect</button>')));
            index++;

            fields.forEach(function (field) {
                var text = 'N/A';
                if (typeof result[field] !== 'undefined') {
                    text = result[field];
                }
                fieldRow.append($('<td>').text(text));
            });

            tbody.append(fieldRow);
        });
        $('#seatTable').append(tbody);
    }


    var fields = resgetFields(res);

    rescreateColumns(fields);
    createData(res.body['result'], fields);
}

function changeSeatHandler(res) {

    function createData(results, fields) {
        var tbody = $('<tbody>');
        results.forEach(function (result) {
            var checkBox = $('<td>').append(
                $('<input>')
                    .attr("type", "radio")
                    .attr("id", result["seatNum"])
                    .attr("name", "seatNumCheckBox"));
            var fieldRow = $('<tr>').append(checkBox);
            fields.forEach(function (field) {
                var text = 'N/A';
                if (typeof result[field] !== 'undefined') {
                    text = result[field];
                }
                fieldRow
                    .append($('<td>')
                        .text(text))
            });

            tbody.append(fieldRow)
        });
        $('#seatTable').append(tbody);

        var seat = $('<td>').append($('<button type="button" class="switch-button btn btn-primary btn-sm" id="switchSeat">Select</button>'));
        var canc = $('<td>').append($('<button type="button" class="cancel-button btn btn-danger btn-sm" id="cancelSwitch">Cancel</button>'));

        $('#seatTable').append($('<td>').append(seat));
        $('#seatTable').append($('<td>').append(canc));

    }

    var fields = resgetFields(res);
    rescreateColumns(fields);
    createData(res.body['result'], fields);

}

function totalCostHandler(res) {

    var cost = res.body['result'];
    console.log(cost);
    var value;
    for (var x in cost) {
        var sum = cost[x];
        for (var t in sum) {
            value = sum[t];

        }
    }
    document.getElementById("demo").innerHTML = '$' + value;


}

function oldSeatHandler(res) {
    console.log(res);
}


function select(oldConfNum, flightN) {

    var delete_sql = deleteOldSeat(oldConfNum);
    postQuerySync({query: delete_sql}, null);

    var check = $('#seatTable').find("input:checked").attr('id');
    console.log(check);
    var update_sql = updateNewSeat(oldConfNum, check, flightN);
    postQuerySync({query: update_sql}, null);
    console.log (oldConfNum, check, flightN);
    var updateprice_sql = updatePrice(oldConfNum, check, flightN);
    postQuerySync({query: updateprice_sql}, null);
    clearResult();
}

function cancelButton(body) {
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.setAttribute("id", "cancelButton");


    body.appendChild(cancelButton);

    cancelButton.addEventListener("click", function () {
        cancelButton.parentElement.removeChild(cancelButton);
        clearResult();
        var drop = dropOldSeatPriceView();
        postQuerySync({query: drop}, null);
        var sql2 = getReservation(email);
        postQuerySync({query: sql2}, reservationHandler);

        var session = window.sessionStorage
        session.removeItem('oldConfNum');
        session.removeItem('flightNum');
        session.removeItem('oldSeatNum');



    })
}


