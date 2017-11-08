
function postQuery(query, handler) {
    $.ajax({
        type: 'POST',
        url: "./query",
        data: query,
        dataType: "json",
        success: handler
    })
}

function samplehandler(res){
    res.data.forEach(function(result) {
        $("#resTable").append("<tr><td>"+ result["id"] +"</td><td>" + result["name"] +"</td></tr>")
    })
}

//TODO: will have to use 'bcrypt' for password encryption
function login(data) {
    //stub
}


$(document).ready(function () {
    $("#QButton").click(function() {
        postQuery({test:"test"}, samplehandler);
    });
});