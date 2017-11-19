

function postQuery(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        success: handler
    })
}

function postQuerySync(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        success: handler,
        async: false
    })
}

function viewHandler(view) {
    //view = JSON.stringify(view);
    console.log(view);

}

function employeeHandler(res) {
    var fields = getEFields(res);

    createEColumns(fields);
    createEData(res.body['result'], fields);
}


function getEFields(res) {
    var fields = [];
    res.body["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    return fields
}

function createEColumns(fields) {
    var fieldRow = $('<tr>');
    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#viewTable').append($('<thead>').append(fieldRow));
}


function createEData(results, fields) {
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
        $('#viewTable').append($('<tbody>').append(fieldRow));
    });
}


function clearEResult() {
    $('#viewTable').text('');
}


function flightAttendantView(){

    return "create view employee_view(name, email) as" +
        " select e.ename, e.email" +
        " from Employee e, FlightAttendant f" +
        " where e.eid = f.eid";
}


function pilotView(){
    return "create view employee_view(name, email) as " +
        " select e.ename, e.email " +
        " from Employee e, FlightAttendant f " +
        " where f.eid = e.eid " +
        " UNION " +
        " select e2.ename, e2.email " +
        " from Employee e2, Pilot p " +
        " where p.eid = e2.eid ";
}

function airlineClerkView (){
    return "create view employee_view(id, name, email, address, age, sin) as" +
        " select eid, ename, email, address, age, sin" +
        " from employee";
}


function dropView(){
    return "drop view employee_view";
}


function displayPilotTable(){
    return "select e.name, e.email from employee_view e, Pilot p, employee m where p.eid = m.eid and m.email = e.email";
}

function displayALLPilotTable(){
    return "select e.id, e.name, e.email, e.address, e.age, e.sin" +
        " from employee_view e, Pilot p, employee m where p.eid = m.eid and m.email = e.email";
}

function displayFlightAttendantTable(){
    return "select * from employee_view e " +
        "where e.email IN (select e2.email from FlightAttendant f, employee e2 where f.eid = e2.eid)";
}

function displayAllEmployeeTable(){
    return "select * from employee_view";
}


function loadBlockContent(url) {
    $('.container').load(url);
}



$(document).ready(function () {
    clearEResult();
    var session = window.sessionStorage,
        usertype = session.getItem('usertype');

    $(document).on("click", "#clear-table", function () {
        clearEResult();
    });

    $(document).on("click", "#view-table", function () {
        clearEResult();
        if (!document.getElementById('pilot').checked && !document.getElementById('flightAttendant').checked && !document.getElementById('all').checked){
            return;
        }
        var view, sql;
        if (usertype ==='flightAttendant') {
            view = flightAttendantView();
        }else if (usertype === 'pilot') {
            view = pilotView();
        }else {
            view = airlineClerkView();
        }

        postQuerySync({query: view}, viewHandler);


        if (document.getElementById('pilot').checked) {
            if (usertype === 'airlineClerk')
                sql = displayALLPilotTable();
            else
                sql = displayPilotTable();
        } else if (document.getElementById('flightAttendant').checked) {
            sql = displayFlightAttendantTable();
        } else if (document.getElementById('all').checked){
            sql = displayAllEmployeeTable();
        }

        postQuerySync({query: sql}, employeeHandler);

        var drop = dropView();
        postQuerySync({query: drop}, viewHandler);


    });


    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './';
    })
});