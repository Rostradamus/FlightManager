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
        dptCity = $input.find("input[id='dptCity']").val();

    // For testing purpose
    email = JSON.stringify(email);

    var addWhere = "";
    if (dptCity !== "")
        addWhere += " and ap.city = " + JSON.stringify(dptCity);
    if (dptDate !== "")
        addWhere += " and d.dptDate = " + JSON.stringify(dptDate);

    return "select  v.name as Name, v.flightNum as FlightNumber, f.duration as Duration, ap.city as City, " +
        "d.dptAirportCode as Airport, d.dptDate as Date, d.dptTime as Time, d.gate as Gate " +
        "from flight f, departure d, airport ap, employee_view v " +
        "where v.flightNum = f.flightNum and ap.acode = d.dptAirportCode  and d.dptDate = f.dptDate and " +
        "d.dptFSid = f.dptFSid and v.email = "+email+""+addWhere;
}


function flightAttendantScheduleView(){

    return "create view employee_view(name, email, flightNum) as" +
    " select e.ename, e.email, fc.flightNum" +
    " from Employee e, FlightAttendant f, Flightcrewassignment fc" +
    " where e.eid = f.eid and f.eid = fc.eid";
}

function dropView(){
    return "drop view employee_view";
}


function pilotScheduleView(){

    return "create view employee_view(name, email, flightNum) as" +
        " select e.ename, e.email, fc.flightNum" +
        " from Employee e, FlightAttendant f, Flightcrewassignment fc" +
        " where e.eid = fc.eid and f.eid = e.eid" +
        " UNION" +
        " select e.ename, e.email, fc.flightNum" +
        " from Employee e, Pilot p, Flightcrewassignment fc" +
        " where e.eid = fc.eid and p.eid = e.eid";

}



function employeeViewOwnFightSchedule(email){
    email = JSON.stringify(email);

    return "select e.ename as name, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber" +
        " from employee e natural join flightcrewassignment l natural join flight f natural join departure d natural join airplane a" +
        " where e.email = " +email+ "";
}

function employeeViewAllFlightSchedule(){
    var $input = $('#employeeSchedule'),
        date = $input.find("input[id='dateSchedule']").val();

    date = JSON.stringify(date);


    return "select e.name as Name, e.email as Email, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber " +
        "from employee_view e natural join flight f natural join departure d natural join airplane a where d.dptDate = "+date+"";


}



$(document).ready(function () {
    clearSResult();
    clearResult_all();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn')),
        email = session.getItem('email'),
        usertype = session.getItem('usertype');

    $(document).on("click", "#clear-schedule", function () {
        clearSResult();
    });

    $(document).on("click", "#submit-schedule", function () {
        clearSResult();
        var $input = $('#Schedule'),
            dptDate = $input.find("input[id='dptDate']").val(),
            dptCity = $input.find("input[id='dptCity']").val();

        if (usertype === 'flightAttendant')
            var view = flightAttendantScheduleView();
        else
            var view = pilotScheduleView();

        postQuerySync({query: view}, viewSHandler);

        if (dptDate === "" && dptCity === "")
            var sql = employeeViewOwnFightSchedule(email);
        else
            var sql = getSchedule(email);

        postQuerySync({query: sql}, scheduleHandler);

        var drop = dropView();
        postQuerySync({query: drop}, viewSHandler);

    });

    $(document).on("click", "#check-all-schedule", function () {
        clearResult_all();

        if (usertype === 'flightAttendant')
            var view = flightAttendantScheduleView();
        else
            var view = pilotScheduleView();

        postQuerySync({query: view}, viewSHandler);

        var sql = employeeViewAllFlightSchedule();
        postQuerySync({query: sql}, scheduleHandler_all);

        var drop = dropView();
        postQuerySync({query: drop}, viewSHandler);

    });



    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});