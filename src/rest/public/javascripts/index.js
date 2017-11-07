
function postQuery(query) {
    // var res = JSON.parse($.ajax({
    //     type: 'POST',
    //     url: "/query",
    //     data: JSON.stringify(query),
    //     contentType: "application/json; charset=utf-8",
    //     async: false
    // }).responseText);
    console.log("Hi");
    console.log(query);
    $.ajax({
        type: 'POST',
        url: "/query",
        data: query,
        dataType: "json",
        contentType: "application/json;",
        success: function (res) {
            console.log(res.result);
            return res.result;
        }
    });
}