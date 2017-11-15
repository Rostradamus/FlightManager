//
//
// function getReservation(email){
//     return "select r.confNum as Confirmation Number, rf.flightNum as Flight Number, s.seatNum as Seat Number, b.tag as Baggage Tag, f.dptDate as Departure Date, f.dptTime as Departure Time" +
//         "from Reservation r, Seat s, ReserveFlight rf, Baggage b, Flight f" +
//         "where r.email = "+email+ " and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum and rf.flightNum = f.flightNum";
// }
//
//
//
// $(document).ready(function () {
//     // clearResult();
//     var session = window.sessionStorage,
//         isLoggedIn = JSON.parse(session.getItem('isLoggedIn'));
//
//     var email = session.getItem('email');
//
//     // if (isLoggedIn) {
//     //
//     //     $('#signup')
//     //         .css("display", "none");
//     //     $('#login')
//     //         .css("display", "none");
//     //     $('#logout')
//     //         .css("display", "inline");
//     //     $('.dropdown')
//     //         .css("display", "inline");
//     //
//     // }
//     // else {
//     //     $('#signup')
//     //         .css("display", "inline");
//     //     $('#login')
//     //         .css("display", "inline");
//     //
//     //     $('#logout')
//     //         .css("display", "none");
//     //     $('.dropdown')
//     //         .css("display", "none");
//     //
//     // }
//     $(document).on("load", "./reservation", function() {
//         var sql = getReservation(email);
//         postQuery({query: sql}, contentsHandler);
//
//
//         // $(document).on("click", "#clearTable", function () {
//         //     clearResult();
//         // });
//         //
//         // $(document).on("click", "#submitQuery", function () {
//         //     clearResult();
//         //     if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
//         //         loadBlockContent('./login');
//         //         return;
//         //     }
//         //
//         //     var sql = getFlightSearchSQL();
//         //
//         //     postQuery({query: sql}, contentsHandler);
//         // });
//         //
//         // $(document).on("click", "#availSeats", function () {
//         //     clearResult();
//         //     if (session === "undefined" || !JSON.parse(session.getItem('isLoggedIn'))){
//         //         window.location.href = './login';
//         //         return;
//         //     }
//         //
//         //     var sql = viewAvailableSeats();
//         //     clearResult();
//         //     postQuery({query: sql}, contentsHandler);
//         // });
//         //
//
//     })
//         $(document).on("click", "#logout", function () {
//             session.clear();
//             window.location.href = './';
//         })
//
// });