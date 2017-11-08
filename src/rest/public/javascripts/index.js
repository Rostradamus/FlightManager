
function postQuery(query) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: query,
        dataType: "json",
        success: function (res) {

            res.data.forEach(function(result) {
                $("#resTable").append("<tr><td>"+ result["id"] +"</td><td>" + result["name"] +"</td></tr>")
            })
        }
    });
}



$(document).ready(function () {
    $("#QButton").click(function() {
        postQuery({test:"test"})
    });
});