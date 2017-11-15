
function getReservation(email){

    var $input = $('#reservationSearch');
    return "select r.confNum as ConfirmationID, rf.flightNum as Flight, s.seatNum as Seat, b.tag as BaggageTag, f.dptDate as Date" +
        " from Reservation r, Seat s, ReserveFlight rf, Baggage b, Flight f" +
        " where r.email = '"+email+ "' and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum and rf.flightNum = f.flightNum";
}

function viewAvailableSeats(flightNum){

    return "select st.price, st.stype, s.seatNum"+
        " from Seat s, SeatType st, Airplane a, Flight f" +
        " where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = "+ flightNum +"";

}


function reservationHandler(res) {


        function createColumns(fields) {
            var fieldRow = $('<tr>');
            fieldRow.append($('<th>').text(""));
            fields.forEach(function(field) {
                fieldRow
                    .append($('<th>')
                        .text(field))
            });

            $('#resTable').append($('<thead>').append(fieldRow));
        }




    function createData(results, fields) {

            var index = 1;
        results.forEach(function (result) {
            var fieldRow = $('<tr>');

            var selectReservation = $('<td>').append($('<button type="button" class="reserve-buttons btn btn-primary btn-xs" id="'+index+'">ReSelect</button>'));
            index++;
            fieldRow
                .append(selectReservation);
            fields.forEach(function (field) {
                var text = 'N/A';
                if (typeof result[field] !== 'undefined') {
                    text = result[field];
                }
                fieldRow.append($('<td>').text(text));
            });

            $('#resTable').append($('<tbody>').append(fieldRow));
        });
    }




    var fields = getFields(res);

    createColumns(fields);
    createData(res.body['result'], fields);
}

function editSeat(){
    $(".reserve-buttons").click(function(){
        var id = $(this).attr('id');

        var flightNum =  document.getElementById('resTable').rows[id].cells[2].innerHTML;
        var sql = viewAvailableSeats(flightNum);
        postQuery({query:sql}, contentsHandler);

    });


}
//     $('#deleteFlights')
//         .css("display", "inline");
// }

//
//
// function deleteFlights() {
//     var toDelete = [];
//
//     $('#resTable').find("input:checked")
//         .map(function (key, value) {
//             if (value["id"] !== "checkAll")
//                 toDelete.push(value["id"]);
//         });
//     if (toDelete.length === 0) return;
//     var sql = "delete from flight where ";
//     toDelete.forEach(function(val, i) {
//         if (i === 0)
//             sql += "flightNum = " + val;
//         else
//             sql += " or flightNum = " + val;
//     });
//     console.log(sql);
//     postQuerySync({query: sql}, searchFlights);
// }



$(document).ready(function () {
    // clearResult();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));

    var email = session.getItem('email');

    var sql = getReservation(email);
    postQuery({query: sql}, reservationHandler);

    $(document).on("click", ".reserve-buttons", function(){
        editSeat();

    })



});