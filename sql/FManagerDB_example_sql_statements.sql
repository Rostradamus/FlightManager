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
4 The passengers can reselect the seat on their flight reservation given the reservation confirmation number
*/

select distinct r.confNum as ConfirmationID, rf.flightNum as Flight, s.seatNum as Seat, ar.carousel as BaggageCarousel, b.tag as BaggageTag, f.dptDate as Date, d.gate as Gate
from Reservation r, Seat s, ReserveFlight rf, Baggage b, Flight f, Airplane a, Departure d, Arrival ar
where r.email = 'hyungro@hotmail.com' and r.confNum = rf.confNum and s.confNum = r.confNum and b.confNum = r.confNum and rf.flightNum = f.flightNum and
d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ar.arrDate = f.arrDate and ar.arrFSid = f.arrFSid
union all select distinct r.confNum as ConfirmationID, rf.flightNum as Flight, s.seatNum as Seat, 'none' as BaggageCarousel, 'none' as BaggageTag, f.dptDate as Date, d.gate as Gate
from Reservation r, Seat s, ReserveFlight rf, Flight f, Airplane a, Departure d, Arrival ar
where r.email = 'hyungro@hotmail.com' and r.confNum = rf.confNum and s.confNum = r.confNum and rf.flightNum = f.flightNum and
d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ar.arrDate = f.arrDate and ar.arrFSid = f.arrFSid and r.confNum <> ALL (select r.confNum from Reservation r, Baggage b2 where r.confNum = b2.confNum);


create or replace view oldseatprice (price, type) as
select st.price, st.stype
from Seat s, SeatType st
where s.stype = st.stype and s.seatNum = '48D';

select st.price as Price, st.stype as Type, s.seatNum
from Seat s, SeatType st, Airplane a, Flight f
where s.isAvailable = 1 and s.stype = st.stype and s.pid = a.pid and a.pid = f.pid and f.flightNum = 888;

update reservation, seat
set seat.confNum = null, seat.isAvailable = 1
where reservation.confNum = seat.confNum and reservation.confNum = 920805;

update reservation, seat, seattype, flight, oldseatprice
set seat.isAvailable = 0, seat.confNum = 920805
where seat.stype = seattype.stype and flight.flightNum = 888 and reservation.confNum = 920805 and flight.pid = seat.pid and seat.seatNum = '5A';

update reservation, seat, seattype, flight, oldseatprice
set reservation.cost = case when seattype.price > oldseatprice.price then reservation.cost - oldseatprice.price + seattype.price else reservation.cost end
where seat.stype = seattype.stype and flight.flightNum = 888 and reservation.confNum = 920805 and flight.pid = seat.pid and seat.seatNum = '5A';

drop view if exists oldseatprice;



/*
5 The flight attendants and pilots can check departure date and city as well as the assigned airplane that correspond to their flight/work schedule.
*/

create view flightAttendant_schedule_view(name, email, flightNum) as
    select e.ename, e.email, fc.flightNum
    from Employee e, FlightAttendant f, Flightcrewassignment fc
    where e.eid = f.eid and f.eid = fc.eid;

create view pilot_schedule_view(name, email, flightNum) as
    select e.ename, e.email, fc.flightNum
    from Employee e, FlightAttendant f, Flightcrewassignment fc
    where e.eid = fc.eid and f.eid = e.eid
    UNION
    select e.ename, e.email, fc.flightNum
    from Employee e, Pilot p, Flightcrewassignment fc
    where e.eid = fc.eid and p.eid = e.eid

select  v.name as Name, v.flightNum as FlightNumber, f.duration as Duration, ap.city as City,
d.dptAirportCode as Airport, d.dptDate as Date, d.dptTime as Time, d.gate as Gate
from flight f, departure d, airport ap, pilot_schedule_view v
where v.flightNum = f.flightNum and ap.acode = d.dptAirportCode  and d.dptDate = f.dptDate and
d.dptFSid = f.dptFSid and v.email = 'tellus@hotmail.com' and ap.city = 'Altenrhein' and d.dptDate = '2017-12-21';


select e.ename as name, d.dptDate as DepartureDate, d.dptTime as DepartureTime, d.dptAirportCode as Airport, a.pid as AirplaneNumber
from employee e natural join flightcrewassignment l natural join flight f natural join departure d natural join airplane a
where e.email = 'tellus@hotmail.com';

select e.name as Name, e.email as Email, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber
from pilot_schedule_view e natural join flight f natural join departure d natural join airplane a where d.dptDate = '2017-12-21';

        
/* 
6 The passenger can check the available flights on certain departure/arrival dates and destination city prior booking the flight
*/
select distinct f.flightNum, f.duration, f.miles, ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime, ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime
from flight f, departure d, arrival a, airport ap1, airport ap2
where ap1.acode = d.dptAirportCode and ap1.city = 'Tokyo' and d.dptDate = '2017-12-21' and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap2.acode = a.arrAirportCode and ap2.city = 'Vancouver' and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid;

/*
8 The customer can make more than one reservations and check the total cost for the tickets (example of ‘SUM’).
*/

select sum(cost)
from Reservation r
where r.email = 'hyungro@hotmail.com'
group by r.email;



/* 
10 The customer can check the maximum allowed weight, size and fee associated with a certain baggage type for a flight
*/
select * from baggageType;



/*
12 Only airline clerks can view all the columns in the Employee table.
The flight attendants and pilots can view only ename and email columns in the Employee table.
The passengers have no access to the Employee table.

*/


create view airlineClerk_employee_view(id, name, email, address, age, sin) as
    select eid, ename, email, address, age, sin
    from employee;

create view pilot_employee_view(name, email) as
    select e.ename, e.email
    from Employee e, FlightAttendant f
    where f.eid = e.eid
    UNION
    select e2.ename, e2.email
    from Employee e2, Pilot p
    where p.eid = e2.eid;

create view flightAttendant_employee_view(name, email) as
    select e.ename, e.email
    from Employee e, FlightAttendant f
    where e.eid = f.eid;

select * from airlineClerk_employee_view e where e.email IN (select e2.email from pilot p, employee e2 where p.eid = e2.eid);

select * from airlineClerk_employee_view e where e.email IN (select e2.email from FlightAttendant f, employee e2 where f.eid = e2.eid)

select * from airlineClerk_employee_view e;

/*
User can update their profile (changing the password or changing the address)
*/

select * from passenger where email = 'test@test.com';
select * from employee where email = 'tellus@hotmail.com';
update passenger set password = 'a123', address = 'my home' where email = 'test@test.com';
update employee set password = 'a123' where email = 'tellus@hotmail.com';
update employee set address = 'my home' where email = 'tellus@hotmail.com';
select password from passenger where email = 'test@test.com';




/*
Additional supporting SQL
*/


