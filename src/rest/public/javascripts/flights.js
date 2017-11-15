function getClerkSearchSQL() {
    var $input = $('#flightSearch'),
        dptCity = $input.find("input[id='dptCity']").val(),
        arrCity = $input.find("input[id='arrCity']").val(),
        dptDateFrom = $input.find("input[id='dptDateFrom']").val(),
        dptDateTo = $input.find("input[id='dptDateTo']").val(),
        isCrewNull = $input.find("input[id='isCrewNull']").is(":checked");
    var where = "where ap1.acode = d.dptAirportCode and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid " +
        "and ap2.acode = a.arrAirportCode and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid";
    if (dptCity !== "")
        where += " and ap1.city = " + JSON.stringify(dptCity);
    if (arrCity !== "")
        where += " and ap2.city = " + JSON.stringify(arrCity);
    if (dptDateFrom !== "")
        where += " and d.dptDate >= " + JSON.stringify(dptDateFrom);
    if (dptDateTo !== "")
        where += " and d.dptDate <= " + JSON.stringify(dptDateTo);
    if (isCrewNull)
        where += " and f.flightNum not in (select flightNum from flightCrewAssignment)";
    var sql = "select distinct f.flightNum, f.duration, f.miles," +
        " ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime," +
        " ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime" +
        " from flight f, departure d, arrival a, airport ap1, airport ap2 " + where;

    return sql;

}

function isValidInput() {
    var $input = $('#flightSearch'),
        dptCity = $input.find("input[id='dptCity']").val(),
        arrCity = $input.find("input[id='arrCity']").val(),
        dptDateFrom = new Date($input.find("input[id='dptDateFrom']").val()),
        dptDateTo = new Date($input.find("input[id='dptDateTo']").val());
    if (dptCity !== "" && arrCity !== "" && dptCity === arrCity) {
        alert('Departure and Arrival City can NOT be the same');
        return false;
    }
    if (dptDateFrom > dptDateTo) {
        alert('Departure date must be before Arrival date');
        return false;
    }
    return true;

}
function flightsHandler(res) {
    function createColumns(fields) {
        var fieldRow = $('<tr>').append($('<th>').html("<input type=\"checkbox\" id=\"checkAll\" name=\"checkAll\"/>"));
        fields.forEach(function(field) {
            fieldRow
                .append($('<th>')
                    .text(field))
        });

        $('#resTable').append($('<thead>').append(fieldRow));
    }

    function createData(results, fields) {
        results.forEach(function(result) {
            var checkBox = $('<td>').append(
                $('<input>')
                    .attr("type", "checkbox")
                    .attr("id", result["flightNum"])
                    .attr("name", "flightCheckBox"));
            var fieldRow = $('<tr>').append(checkBox);
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

    var fields = getFields(res);

    createColumns(fields);
    createData(res.body['result'], fields);
    $('#deleteFlights')
        .css("display", "inline");
}

function deleteFlights() {
    var toDelete = [];

    $('#resTable').find("input:checked")
        .map(function (key, value) {
            if (value["id"] !== "checkAll")
                toDelete.push(value["id"]);
        });
    if (toDelete.length === 0) return;
    var sql = "delete from flight where ";
    toDelete.forEach(function(val, i) {
        if (i === 0)
            sql += "flightNum = " + val;
        else
            sql += " or flightNum = " + val;
    });
    console.log(sql);
    postQuerySync({query: sql}, searchFlights);
}

function searchFlights() {
    clearResult();
    var $input = $('#flightSearch'),
        dptCity = $input.find("input[id='dptCity']").val(),
        arrCity = $input.find("input[id='arrCity']").val(),
        dptDateFrom = $input.find("input[id='dptDateFrom']").val(),
        dptDateTo = $input.find("input[id='dptDateTo']").val(),
        isCrewNull = $input.find("input[id='isCrewNull']").is(":checked");
    console.log(dptCity, arrCity, dptDateFrom, dptDateTo, isCrewNull);

    if (!isValidInput()) return;

    var sql = getClerkSearchSQL();

    postQuery({query: sql}, flightsHandler);
}

$(document).ready(function() {
    $(document).on("click", "#submit-flight-search", function () {
        searchFlights();
    });
    $(document).on("click", "#checkAll", function () {
        if($(this).is(':checked')){
            $('input[name="flightCheckBox"]').prop("checked", true);
        } else {
            $('input[name="flightCheckBox"]').prop("checked", false);
        }
    });
});