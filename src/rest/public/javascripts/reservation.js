
function getReservation(email){

    var $input = $('#reservationSearch');
    return "select r.confNum as ConfirmationID, rf.flightNum as Flight, s.seatNum as Seat, b.tag as BaggageTag, f.dptDate as Date" +
        " from Reservation r, Seat s, ReserveFlight rf, Baggage b, Flight f" +
        " where r.email = '"+email+ "' and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum and rf.flightNum = f.flightNum";
}

function viewAvailableSeats(flightNum){

    return "select st.price as Price, st.stype as Type, s.seatNum"+
        " from Seat s, SeatType st, Airplane a, Flight f" +
        " where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = "+ flightNum +"";

}

function deleteOldSeat(confNum){
    return "update reservation, seat"+
        " set seat.confNum = null, seat.isAvailable = 1"+
        " where reservation.confNum = seat.confNum and reservation.confNum = "+ confNum +"";

}

function updateNewSeat(confNum, seatNum, flightNum){

    return "update reservation, seat, seattype, flight" +
    " set reservation.cost = seattype.price, seat.isAvailable = 0, seat.confNum = "+ confNum +""+
    " where seat.stype = seattype.stype and flight.flightNum = "+flightNum+" and reservation.confNum = "+confNum+" and flight.pid = seat.pid and seat.seatNum = '"+seatNum+"'";
}

function passengerCheckTotalCost (email){

    return "select sum(cost)" +
        " from Reservation r" +
        " where r.email = '"+email+"'" +
        " group by r.email";
}

function createColumns(fields) {
    var fieldRow = $('<tr>');
    fieldRow.append($('<th>').text(""));
    fields.forEach(function(field) {
        fieldRow
            .append($('<th>')
                .text(field))
    });

    $('#seatTable').append($('<thead>').append(fieldRow));
}

function clearResult() {
    $('#seatTable').text('');
  
}



function reservationHandler(res) {


    function createData(results, fields) {

            var index = 1;
            results.forEach(function (result) {
            var fieldRow = $('<tr>');

            fieldRow.append($('<td>').append($('<button type="button" class="reserve-buttons btn btn-primary btn-xs" id="'+index+'">ReSelect</button>')));
            index++;

            fields.forEach(function (field) {
                var text = 'N/A';
                if (typeof result[field] !== 'undefined') {
                    text = result[field];
                }
                fieldRow.append($('<td>').text(text));
            });

            $('#seatTable').append($('<tbody>').append(fieldRow));
        });
    }




    var fields = getFields(res);

    createColumns(fields);
    createData(res.body['result'], fields);
}

function changeSeatHandler(res){

    function createData(results, fields) {
        results.forEach(function (result) {
            var checkBox = $('<td>').append(
                $('<input>')
                    .attr("type", "radio")
                    .attr("id", result["seatNum"])
                    .attr("name", "seatNumCheckBox"));
            var fieldRow = $('<tr>').append(checkBox);
            fields.forEach(function (field) {
                var text = 'N/A';
                if (typeof result[field] !== 'undefined') {
                    text = result[field];
                }
                fieldRow
                    .append($('<td>')
                        .text(text))
            });




            // var seat= $('<td>').append($('<button type="button" class="switch-button btn btn-primary btn-xs" id="switchSeat">Select</button>'));
            // // switchRow
            // //     .append(seat);
            //
            // fieldRow.append($('<td>').append(seat));

            $('#seatTable').append($('<tbody>').append(fieldRow));




        });

        var seat= $('<td>').append($('<button type="button" class="switch-button btn btn-primary btn-xs" id="switchSeat">Select</button>'));
        // switchRow
        //     .append(seat);

        $('#seatTable').append($('<td>').append(seat));
        //
        // var buttonnode= document.createElement('input');
        // buttonnode.setAttribute('type','button');
        // buttonnode.setAttribute('id', 'switchSeat');
        // buttonnode.setAttribute('value','switch');
        //
        // var body = document.getElementById("reservationSearch");
        // body.append(buttonnode);
    }
    var fields = getFields(res);
    createColumns(fields);
    createData(res.body['result'],fields);

}

function totalCostHandler(res){

    // document.getElementById("demo").innerHTML= "'"+res.body['result']+"'";
    var cost = res.body['result'];
    console.log(cost);
    var value;
    for (var x in cost){
        var sum = cost[x];
        for (var t in sum){
            value = sum[t];

        }
    }
    document.getElementById("demo").innerHTML= '$'+value;


}


// function editSeat(){
//     $(".reserve-buttons").click(function(){
//         var id = $(this).attr('id');
//         console.log(id);
//         console.log(document.getElementById('seatTable'));
//         var flightNum =  document.getElementById('seatTable').rows[id].cells[2].innerHTML;
//         oldConfNum = document.getElementById('seatTable').rows[id].cells[1].innerHTML;
//         oldSeatNum = document.getElementById('seatTable').rows[id].cells[3].innerHTML;
//         console.log(oldSeatNum);
//         console.log(oldConfNum);
//
//         var sql = viewAvailableSeats(flightNum);
//         clearResult();
//         postQuery({query:sql}, changeSeatHandler);
//
//     });



function select(oldConfNum,flightN, seatN){


    var check = $('#seatTable').find("input:checked").attr('id');

    var delete_sql = deleteOldSeat(oldConfNum);
    postQuerySync({query:delete_sql},null);
    // console.log(oldConfNum);
    // console.log(seatN);
    var update_sql = updateNewSeat(oldConfNum, check, flightN);
    postQuerySync({query:update_sql},reservationHandler);
    clearResult();





}




$(document).ready(function () {
    // clearResult();
    var session = window.sessionStorage,
        isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));

    var email = session.getItem('email');

    var sql = getReservation(email);
    postQuery({query: sql}, reservationHandler);

    $(document).on("click","#totalCost", function() {
        var cost_sql = passengerCheckTotalCost(email);
        postQuery({query: cost_sql}, totalCostHandler);
    });


    // var oldConfNum;
    // var oldSeatNum;
    $(document).on("click", ".reserve-buttons", function() {

        var id = $(this).attr('id');
        // console.log(id);
        // console.log(document.getElementById('seatTable'));
        var flightNum = document.getElementById('seatTable').rows[id].cells[2].innerHTML;
        var oldConfNum = document.getElementById('seatTable').rows[id].cells[1].innerHTML;
       // var oldSeatNum = document.getElementById('seatTable').rows[id].cells[3].innerHTML;
        // console.log(oldSeatNum);
        // console.log(oldConfNum);

        session.setItem('oldConfNum', oldConfNum);
        session.setItem('flightNum', flightNum);

        var seats_sql = viewAvailableSeats(flightNum);
        clearResult();
        postQuery({query: seats_sql}, changeSeatHandler);


    });

    $(document).on("click", '#switchSeat', function() {
        // var seatNum = $('#seatTable').find('input:checked').attr('id');

        // console.log(seatNum);
        // session.setItem('seatNum', seatNum);

        var ConfNum = session.getItem('oldConfNum');
        var FlightNum = session.getItem('flightNum');
        // var SeatN = session.getItem('seatNum');
        select(ConfNum, FlightNum);

        session.removeItem('oldConfNum');
        session.removeItem('flightNum');
        var sql2 = getReservation(email);

        postQuerySync({query: sql2}, reservationHandler);

    });

});