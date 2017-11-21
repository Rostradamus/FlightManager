use FlightManager;

/* 
1a The passengers can reserve a flight, select a seat with a certain seat type, and claim baggages on a specified arrival/departure dates and times as well as destination
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
1b The airline clerks should be able to assign a pilot to a flight only if the pilot has a valid medical certification and has flown an airplane within the last 2 years
*/

select d.dptDate as Date, d.dptTime as Time, ap.acode as AirportCode,
aname as Airport, City, Country, terminal, gate from flight f, departure d, airport ap
where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap.acode = d.dptAirportCode and flightNum = 70;

select ename as Name, age as Age, eid as ID, email as Email, lastFlyDate, medCertExpDate
from pilot natural join employee
where lastFlyDate >= "2015-11-15"
and medCertExpDate >= "2017-11-15"
and eid not in
    (select distinct eid from flightCrewAssignment natural join flight
    where arrDate >= "2017-11-15" and dptDate <= "2017-11-15")
order by lastFlyDate;

insert into flightCrewAssignment(eid, flightNum) values (57773 , 70);

/*
2 The airline clerks should be able to delete flights within the certain range of period, cascading the related data, such as reservation, baggage, and flight schedule
*/

select distinct f.flightNum, f.duration, f.miles, f.pid, ap1.city as dptCity, d.dptAirportCode as dptAirport, d.dptDate, d.dptTime, ap2.city as arrCity, a.arrAirportCode as arrAirport, a.arrDate, a.arrTime
from flight f, departure d, arrival a, airport ap1, airport ap2
where ap1.acode = d.dptAirportCode and d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap2.acode = a.arrAirportCode
and a.arrDate = f.arrDate and a.arrFSid = f.arrFSid and d.dptDate >= "2017-11-01" and d.dptDate <= "2017-11-30"

delete from flight where flightNum = 70 or flightNum = 606

/*
3 The airline clerks may need to update gate number for departure for a particular flight scheduled at an airport on a given date
*/

select d.dptDate as Date, d.dptTime as Time, ap.acode as AirportCode,
aname as Airport, City, Country, terminal, gate from flight f, departure d, airport ap
where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and ap.acode = d.dptAirportCode and flightNum = 70;

update departure d, flight f
set terminal = "main", gate = "A1"
where d.dptDate = f.dptDate and d.dptFSid = f.dptFSid and flightNum = 70;

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
from Seat s, SeatType st, Flight f
where s.stype = st.stype and s.seatNum = '48D' and f.flightNum = 888;

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
7 Before the assignment of flight attendants and pilots to a flight, the airline clerks should be able to see all the employees’ schedule on a certain date and time
*/
create view pilot_schedule_view(name, email, flightNum) as
    select e.ename, e.email, fc.flightNum
    from Employee e, FlightAttendant f, Flightcrewassignment fc
    where e.eid = fc.eid and f.eid = e.eid
    UNION
    select e.ename, e.email, fc.flightNum
    from Employee e, Pilot p, Flightcrewassignment fc
    where e.eid = fc.eid and p.eid = e.eid;

select e.name as Name, e.email as Email, d.dptDate as DepartureDate, d.dptTime as DepartureTime, a.pid as AirplaneNumber
from pilot_schedule_view e natural join flight f natural join departure d natural join airplane a where d.dptDate = "2017-11-15";


/*
8 The customer can make more than one reservations and check the total cost for the tickets (example of ‘SUM’).
*/

select sum(cost)
from Reservation r
where r.email = 'hyungro@hotmail.com'
group by r.email;

/*
9 The airline clerks can check the number of any specific type of seat (eg. economy seats) left for a flight on a given time and date
*/

select stype as Type, COUNT(seatNum) as Available
from flight f natural join airplane p natural join seat s natural join seatType st
where isAvailable=1 and flightNum = 70 group by flightNum, stype;

select stype as Type, COUNT(seatNum) as Available
from flight f natural join airplane p natural join seat s natural join seatType st
where isAvailable=1 and stype = "economy" and flightNum = 70 group by flightNum, stype;

select stype as Type, COUNT(seatNum) as Available
from flight f natural join airplane p natural join seat s natural join seatType st
where isAvailable=1 and stype = "business" and flightNum = 70 group by flightNum, stype;

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
Additional supporting SQL: User can update their profile (changing the password or changing the address)
*/

select * from passenger where email = 'test@test.com';
select * from employee where email = 'tellus@hotmail.com';
update passenger set password = 'a123', address = 'my home' where email = 'test@test.com';
update employee set password = 'a123' where email = 'tellus@hotmail.com';
update employee set address = 'my home' where email = 'tellus@hotmail.com';
select password from passenger where email = 'test@test.com';
