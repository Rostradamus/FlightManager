

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


function getSchedule() {
    var $input = $('#flightSearch'),
        dptDate = $input.find("input[id='dptDate']").val(),
        dptCity = $input.find("input[id='dptCity']").val();

    // For testing purpose
    // var dptDate = "2017-12-21";
    // var arrCity = "Vancouver";
    // var dptCity = "Tokyo";
/*
    return "select distinct f.flightNum, f.duration, " +
        "d.dptDate" +
        " from flight f, departure d, arrival a, airport ap, employee e, flightcrewassignment fca " +
        "where fca.flightNum = f.flightNum and fca.eid = e.eid and e.email = " +email+ " and d.dpyDate = "+dptDate+" +
        "and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap.acode  = d.dptAirportcode and " +
        "ap.city  = "+dptCity+" and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap.acode  = d.dptAirportcode and ap.city  = " +dptCity+"and f.arrFSid = a.arrFSid and f.arrDate = a.arrDate";
*/
    return "select f.flightNum " +
        "from flight f, departure d" +
        "where f.dptFSid = d.dptFSid and d.dptDate = "+dptDate+"";


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

function getEmployeeEID(email){
    return "select eid from employee where email = "+email+"";
}

function loadBlockContent(url) {
    $('.container').load(url);
}



$(document).ready(function () {
    clearResult();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));
        //email = JSON.parse(session.getItem('email'));


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

        var sql = getSchedule();

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