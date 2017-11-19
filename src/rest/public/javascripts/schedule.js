function viewSHandler(view) {
    //view = JSON.stringify(view);
    console.log(view);

}

function scheduleHandler(res) {
    var fields = getFieldS(res);

    createColumnS(fields);
    createDataS(res.body['result'], fields);
}

function scheduleHandler_all(res) {
    var fields = getFieldS(res);

    createColumns_all(fields);
    createData_all(res.body['result'], fields);
}

function getFieldS(res) {
    var fields = [];
    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    return fields
}

function createColumnS(fields) {
    var fieldRow = $('<tr>');
    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#sTable').append($('<thead>').append(fieldRow));
}

function createColumns_all(fields) {
    var fieldRow = $('<tr>');
    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#allTable').append($('<thead>').append(fieldRow));
}

function createDataS(results, fields) {
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
        $('#sTable').append($('<tbody>').append(fieldRow));
    });
}

function createData_all(results, fields) {
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
        $('#allTable').append($('<tbody>').append(fieldRow));
    });
}



function clearSResult() {
    $('#sTable').text('');
}

function clearResult_all() {
    $('#allTable').text('');
}


function getSchedule(email) {
    clearResult();
    var $input = $('#Schedule'),
        dptDate = $input.find("input[id='dptDate']").val(),
        dptCity = $input.find("input[id='dptCity']").val(),
        usertype = window.sessionStorage.getItem('usertype');

    if (usertype === "pilot")
        var view = "pilot_schedule_view";
    else
        var view = "flightAttendant_schedule_view";

    email = JSON.stringify(email);

    var addWhere = "";
    if (dptCity !== "")
        addWhere += " and ap.city = " + JSON.stringify(dptCity);
    if (dptDate !== "")
        addWhere += " and d.dptDate = " + JSON.stringify(dptDate);

    return "select  v.name as Name, v.flightNum as FlightNumber, f.duration as Duration, ap.city as City, " +
        "d.dptAirportCode as Airport, d.dptDate as Date, d.dptTime as Time, d.gate as Gate " +
        "from flight f, departure d, airport ap, "+ view+" v " +
        "where v.flightNum = f.flightNum and ap.acode = d.dptAirportCode  and d.dptDate = f.dptDate and " +
        "d.dptFSid = f.dptFSid and v.email = "+email+""+addWhere;
}



function employeeViewOwnFightSchedule(email){
    email = JSON.stringify(email);

    return "select e.ename as name, f.flightNum as FlightNumber, d.dptDate as DepartureDate, d.dptTime as DepartureTime, d.dptAirportCode as Airport" +
        " from employee e natural join flightcrewassignment l natural join flight f natural join departure d natural join airplane a" +
        " where e.email = " +email+ "";
}

function employeeViewAllFlightSchedule(){
    var $input = $('#employeeSchedule'),
        date = $input.find("input[id='dateSchedule']").val();

    date = JSON.stringify(date);

    var session = window.sessionStorage,
        usertype = session.getItem('usertype');

    if (usertype === "pilot")
        var view = "pilot_schedule_view";
    else
        var view = "flightAttendant_schedule_view";

    return "select e.name as Name, e.email as Email, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber " +
        "from "+ view+" e natural join flight f natural join departure d natural join airplane a where d.dptDate = "+date+"";


}



$(document).ready(function () {
    clearSResult();
    clearResult_all();
    var session = window.sessionStorage,
        email = session.getItem('email');

    $(document).on("click", "#clear-schedule", function () {
        clearSResult();
    });

    $(document).on("click", "#submit-schedule", function () {
        clearSResult();
        var $input = $('#Schedule'),
            dptDate = $input.find("input[id='dptDate']").val(),
            dptCity = $input.find("input[id='dptCity']").val();

        if (dptDate === "" && dptCity === "")
            var sql = employeeViewOwnFightSchedule(email);
        else
            var sql = getSchedule(email);

        postQuerySync({query: sql}, scheduleHandler);

    });

    $(document).on("click", "#check-all-schedule", function () {
        clearResult_all();

        var sql = employeeViewAllFlightSchedule();
        postQuerySync({query: sql}, scheduleHandler_all);

    });

    $(document).on("click", "#clear-all-schedule", function(){
        clearResult_all();
    });

    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});