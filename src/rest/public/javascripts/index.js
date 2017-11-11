
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



function clearResult() {
    $('#resTable').text('');
}



$(document).ready(function () {
    clearResult();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));
    if (isLoggedIn) {
        var logout = $('<a>')
            .attr('id', 'logout')
            .text("Logout");

        $('#right').append($('<li>')
            .append(logout))
    }
    else {
        var signup =  $('<a>')
            .attr('href', '/signup')
            .text("Sign Up");
        var login = $('<a>')
            .attr('href', '/login')
            .text('Login');
        $('#right')
            .append($('<li>')
                .append(signup))
            .append($('<li>')
                .append(login))
    }

    $("#clearTable").click(function () {
        clearResult();
    });

    $("#submitQuery").click(function() {
        clearResult();
        if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
            window.location.href = './login';
            return;
        }
        var sql = "select * from passenger natural join mileagemember";
        postQuery({query: sql}, contentsHandler);
    });

    $(document).on("click", "#logout", function () {
        session.clear();
        window.location.href = './'
    })
});