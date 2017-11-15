
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

    $('#queryTable').append($('<thead>').append(fieldRow));
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
        $('#queryTable').append($('<tbody>').append(fieldRow));
    });
}

function getReservation(email){
    return "select r.confNum as Confirmation Number, rf.flightNum as Flight Number, s.seatNum as Seat Number, b.tag as Baggage Tag, f.dptDate as Departure Date, f.dptTime as Departure Time" +
        "from Reservation r, Seat s, ReserveFlight rf, Baggage b, Flight f" +
        "where r.email = "+email+ " and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum and rf.flightNum = f.flightNum";
}



$(document).ready(function () {
    clearResult();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));

        email = JSON.parse(session.getItem('email'));
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

    var sql = getReservation(email);
    postQuery({query:sql}, contentsHandler);



    // $(document).on("click", "#clearTable", function () {
    //     clearResult();
    // });
    //
    // $(document).on("click", "#submitQuery", function () {
    //     clearResult();
    //     if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
    //         loadBlockContent('./login');
    //         return;
    //     }
    //
    //     var sql = getFlightSearchSQL();
    //
    //     postQuery({query: sql}, contentsHandler);
    // });
    //
    // $(document).on("click", "#availSeats", function () {
    //     clearResult();
    //     if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
    //         window.location.href = './login';
    //         return;
    //     }
    //
    //     var sql = viewAvailableSeats();
    //     clearResult();
    //     postQuery({query: sql}, contentsHandler);
    // });
    //




    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});