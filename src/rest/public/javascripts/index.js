
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
    var fields = [];

    res.data["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    createColumns(fields);
    createData(res.data['result'], fields);
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

//TODO: login may be required
function login(data) {
    //stub
}

function clearResult() {
    $('#resTable').text('');
}

$(document).ready(function () {
    $("#clearTable").click(function () {
        clearResult();
    });

    $("#submitQuery").click(function() {
        clearResult();
        var sql = "select * from passenger p";
        postQuery({query: sql}, contentsHandler);
    });
});