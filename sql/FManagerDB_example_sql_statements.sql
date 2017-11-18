use FlightManager;

/* 
1 The passengers can reserve a flight, select a seat with a certain seat type, and claim baggages on a specified arrival/departure dates and times as well as destination
*/
select pid from flight f where f.flightNum = 123;

select s.seatNum, st.stype, st.price
from Seat s, SeatType st, Airplane a, Flight f
where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = 123
order by st.price;

select mpoint from mileagemember where email = 'kes4135@gmail.com';

insert into reservation values(52270,2345.25,1,1,'kes4135@gmail.com');

insert into reserveFlight values(52270,123);

insert into baggage values(2883884880,'checked',0101,52270);

update mileagemember m
set m.mpoint = 3490 
where m.email = 'kes4135@gmail.com';

update seat
set seat.isAvailable = 0, seat.confNum = 52270
where seat.pid = 0101 and seat.seatNum = '35B';

select b.btype as Baggage, b.tag 
from baggage b 
where b.pid = 0101 and b.confNum = 52270;
        
/* 
6 The passenger can check the available flights on certain departure/arrival dates and destination city prior booking the flight
*/
select distinct f.flightNum, f.duration, f.miles, ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime, ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime
from flight f, departure d, arrival a, airport ap1, airport ap2
where ap1.acode = d.dptAirportCode and ap1.city = 'Tokyo' and d.dptDate = '2017-12-21' and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap2.acode = a.arrAirportCode and ap2.city = 'Vancouver' and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid;

/* 
10 The customer can check the maximum allowed weight, size and fee associated with a certain baggage type for a flight
*/
select * from baggageType;

/* 
Additional supporting SQL 
*/


