
function postQuery(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        success: handler
    })
}

function contentsHandler(res){
    var fields = [];

    res.data["fields"].forEach(function (field) {
        fields.push(field["name"]);
    });
    createColumns(fields);
    res.data["result"].forEach(function(result) {
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
    })
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

function rowHandler(res) {

}

//TODO: will have to use 'bcrypt' for password encryption
function login(data) {
    //stub
}


$(document).ready(function () {
    $("#QButton").click(function() {
        $('#resTable').text('');
        var sql = "select * from passenger p natural join mileagemember m";
        postQuery({query: sql}, contentsHandler);
    });
});