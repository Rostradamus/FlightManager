

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


function displayPilotTable(view){
    return "select * from " + view + " e where e.email IN (select e2.email from pilot p, employee e2 where p.eid = e2.eid)";
}


function displayFlightAttendantTable(view){
    return "select * from " + view + " e where e.email IN (select e2.email from FlightAttendant f, employee e2 where f.eid = e2.eid)";
}

function displayAllEmployeeTable(view){
    return "select * from " + view;
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
        var view = usertype + "_employee_view",
            sql;


        if (document.getElementById('pilot').checked) {
            sql = displayPilotTable(view);
        } else if (document.getElementById('flightAttendant').checked) {
            sql = displayFlightAttendantTable(view);
        } else if (document.getElementById('all').checked){
            sql = displayAllEmployeeTable(view);
        }

        postQuerySync({query: sql}, employeeHandler);

    });

});