create database FlightManager;


use FlightManager;


-- TODO: password might have to be CHAR(60) BINARY if we have to encrypt
create table passenger (
	email VARCHAR(255),
	password CHAR(60) NOT NULL,
	pname CHAR(20) NOT NULL,
	phone CHAR(17) NOT NULL,
	dateofbirth DATE,
	address CHAR(30),
	PRIMARY KEY(email),
	UNIQUE(phone)
);

create table mileagemember (
	email VARCHAR(255),
	mpoint INT(10),
	PRIMARY KEY(email),
	FOREIGN KEY(email) references passenger(email)
);


insert into passenger(email, password, pname, phone, dateofbirth, address) values
('hyungro@hotmail.com', 'a49806102', 'Ro Lee', '778-681-7674', '1992-04-29', '6375 Boundary Road, Vancouver');
insert into passenger(email, password, pname, phone) values
('test@test.com', 'a12345678', 'Test User', '123-456-7890');
insert into passenger(email, password, pname, phone) values
('abcd@abcd.com', 'a11111111', 'ABC DEF', '111-111-1111');
insert into passenger(email, password, pname, phone) values
('johnnykim@gmail.com', 'a49806102', 'John Kim', '604-436-4938');
insert into passenger(email, password, pname, phone) values
('chadol26@gmail.com', 'a46473154', 'Jay Yi', '778-891-5538');
insert into passenger(email, password, pname, phone, dateofbirth, address) values
('eomubc@gmail.com', 'a32905127', 'Haeun Eom', '778-828-0091', '1995-03-20', '500 Grandview Hwy, Burnaby');
insert into passenger(email, password, pname, phone, dateofbirth) values
('kes4135@gmail.com', 'a98765432', 'Waylon Dalton', '778-800-7865', '1967-07-01');
insert into passenger(email, password, pname, phone, dateofbirth) values
('najan73@yopmail.com', 'a87654321', 'Justine Hend', '604-322-1234', '1970-01-07');
insert into passenger(email, password, pname, phone, dateofbirth) values
('gordonjcp@hotmail.com', 'a76543210', 'Gordon Lang', '778-000-8888', '1975-12-25');
insert into passenger(email, password, pname, phone, dateofbirth, address) values
('mthurn@live.com', 'a32005127', 'Marcus Cruz', '604-565-9178', '1990-08-15', '11-1200 Granville Street, Vancouver');
insert into passenger(email, password, pname, phone) values
('sakusha@yahoo.ca', 'a00005117', 'Thalia Cobb', '604-112-0129');
insert into passenger(email, password, pname, phone) values
('drezet@me.com', 'a18929323', 'Mathias Littlem', '778-909-0000');
insert into passenger(email, password, pname, phone, dateofbirth) values
('miyop@icloud.com', 'a99991222', 'Eddie Randolph', '778-800-9988', '1985-03-03');
insert into passenger(email, password, pname, phone, dateofbirth, address) values
('konit@icloud.com', 'a12121212', 'Angela Walker', '778-828-0091', '1987-11-08', '6005 Walter Gage Road, Vancouver');
insert into passenger(email, password, pname, phone) values
('wsnyder@gmail.com', 'a98989898', 'Jonathon Sheppard', '604-121-2121');




insert into mileagemember values
('hyungro@hotmail.com', 400);
insert into mileagemember values
('johnnykim@gmail.com', 12200);
insert into mileagemember values
('kes4135@gmail.com', 300);
insert into mileagemember values
('najan73@yopmail.com', 0);
insert into mileagemember values
('mthurn@live.com', 10000);
insert into mileagemember values
('sakusha@yahoo.ca', 5500);
insert into mileagemember values
('drezet@me.com', 4700);
insert into mileagemember values
('miyop@icloud.com', 100);
insert into mileagemember values
('konit@icloud.com', 900);
insert into mileagemember values
('wsnyder@gmail.com', 750);


INSERT INTO reservation (confNum, cost, pointUsed, medProtectionUsed, email) VALUES
(925315,1110.91,1,0, 'hyungro@hotmail.com');
INSERT INTO reservation VALUES
(299846,826.04,0,1, 'chadol26@gmail.com');
INSERT INTO reservation VALUES
(365157,703.01,0,1, 'johnnykim@gmail.com');
INSERT INTO reservation VALUES
(768572,794.99,0,1, 'kes4135@gmail.com');
INSERT INTO reservation VALUES
(420430,833.98,1,1, 'najan73@yopmail.com');
INSERT INTO reservation VALUES
(052636,671.95,1,0, 'gordonjcp@hotmail.com');
INSERT INTO reservation VALUES
(330960,1410.30,0,0, 'wsnyder@gmail.com');
INSERT INTO reservation VALUES
(691105,338.00,0,0, 'sakusha@yahoo.ca');
INSERT INTO reservation VALUES
(499260,543.46,0,0, 'drezet@me.com')
INSERT INTO reservation VALUES
(178941,939.12,1,0, 'mthurn@live.com')
INSERT INTO reservation VALUES
(234970,1028.38,0,0, 'abcd@abcd.com')
INSERT INTO reservation VALUES
(231503,666.21,0,1, 'miyop@icloud.com')
INSERT INTO reservation VALUES
(792310,595.07,1,1, 'konit@icloud.com')


INSERT INTO seat (seatNum, isAvailable, stype, pid, confNum) values
("698", 0, 'economy', 0101, 925315);
INSERT INTO seat values
("118", 0, 'economy', 9709, 299846);
INSERT INTO seat values
("406", 1, 'economy', 9709, 365157);
INSERT INTO seat values
("550", 1, 'business', 3835, 768572);
INSERT INTO seat values
("677", 1, 'business', 0790, 420430);
INSERT INTO seat values
("002", 0, 'business', 9960, 052636);
INSERT INTO seat values
("153", 1, 'first-class', 2415, 330960);
INSERT INTO seat values
("601", 0, 'economy', 2415, 691105);
INSERT INTO seat values
("428", 1, 'economy', 3521, 499260);
INSERT INTO seat values
("944", 1, 'first-class', 3518, 178941);
INSERT INTO seat values
("985", 0, 'business', 6787, 234970);
INSERT INTO seat values
("931", 1, 'economy', 6787, 231503);
INSERT INTO seat values
("888", 1, 'economy', 6787, 792310);




-- Todo : seatTypes?
insert into seattype (stype, price, legroom) values
('first-class', 15000.00, 150.00);
insert into seattype values
('business', 8000.00, 100.00);
insert into seattype values
('economy', 1200.00, 50.00);



-- Todo : check pcode, ptype
insert into airplane (pid, pcode, ptype, numEconSeat, numBusnSeat, numFCSeat) values
(0101, 'AC', 'Boeing 767-800', 200, 30, 10);
(9709, 'AC', 'Airbus A330-300', 340, 60, 14);
(3835, 'AC', 'Boeing 787-8', 100, 10, 0);
(0790, 'AC', 'Airbus A330-300', 250, 46, 10);
(9960, 'AC', 'Boeing 767-300', 80, 6, 0);
(2415, 'AC', 'Boeing 787-9', 400, 60, 20);
(3521, 'AC', 'Boeing 767-300', 200, 40, 10);
(3518, 'AC', 'Boeing 777-200', 300, 50, 12);
(6787, 'AC', 'Airbus A300-330', 450, 70, 26);



insert into baggage(tag, btype, pid, confNum) values
(1111100000, 'carry-on', 0101, 925315);
INSERT INTO seat values
(8888888888, 'carry-on', 9709, 299846);
INSERT INTO seat values
(4040404040, 'checked', 9709, 365157);
INSERT INTO seat values
(5500111111, 'checked', 3835, 768572);
INSERT INTO seat values
(9009999876, 'checked', 0790, 420430);
INSERT INTO seat values
(2100022222, 'checked', 9960, 052636);
INSERT INTO seat values
(1234987653, 'carry-on', 2415, 330960);
INSERT INTO seat values
(0908070980, 'carry-on', 2415, 691105);
INSERT INTO seat values
(5789000000, 'checked', 3521, 499260);
INSERT INTO seat values
(9554944949, 'checked', 3518, 178941);
INSERT INTO seat values
(5895895895, 'checked', 6787, 234970);
INSERT INTO seat values
(0310310982, 'checked', 6787, 231503);
INSERT INTO seat values
(2502502500, 'carry-on', 6787, 792310);


-- Todo : check baggage types
insert into baggageType(btype, maxSize, maxWeight, fee) values
('carry-on', 118, 10, 0)
insert into baggageType(btype, maxSize, maxWeight, fee) values
('checked', 158, 23, 25)



insert into airport(acode, aname, city, country) values
('YVR', 'Vancouver International Airport', 'Vancouver', 'Canada')
insert into airport values
('YCD', 'Vancouver - Nanaimo Airport', 'Vancouver', 'Canada')
insert into airport values
('ICN', 'Incheon International Airport', 'Incheon', 'South Korea')
insert into airport values
('JFK', 'John F Kennedy International Airport', 'New York', 'US')
insert into airport values
('SCN', 'Saarbrucken Airport', 'Saarbrucken', 'Germany')
insert into airport values
('ACH', 'St Gallen', 'Altenrhein', 'Switzerland')
insert into airport values
('NRT', 'New Tokyo International Airport', 'Tokyo', 'Japan')
insert into airport values
('IGR', 'Iguazu International Airport', 'Puerto Iguazú', 'Argentina')
insert into airport values
('NAN', 'Nadi International Airport', 'Nadi', 'Fiji')
insert into airport values
('NKG', 'Nanjing Lukou International Airport', 'Nanjing', 'China')



insert into arrival(arrDate, arrFSid, arrTime, carousel, arrAirportCode) values
-- Todo : check arrFSid and carousel values
('2017-12-21', 1200, '12:30', 12, 'YVR');
insert into arrival values
('2018-05-01', 1530, '09:30', 05, 'YVR');
insert into arrival values
('2017-11-15', 0820, '15:40', 11, 'ICN');
insert into arrival values
('2018-01-02', 9999, '18:30', 07, 'YCD');
insert into arrival values
('2017-11-25', 8787, '08:00', 12, 'YVR');
insert into arrival values
('2018-07-10', 6060, '14:30', 04, 'SCN');
insert into arrival values
('2018-02-23', 1000, '16:00', 02, 'JFK');
insert into arrival values
('2018-10-20', 0090, '12:30', 13, 'YVR');
insert into arrival values
('2017-12-30', 5678, '13:10', 04, 'NKG');
insert into arrival values
('2017-11-21', 8765, '11:25', 15, 'YCD');


insert into deparature(dptDate, dptFSid, dptTime, terminal, gate, dptAirportCode) values
-- Todo : need to fiil in terminal and gate
('2017-12-21', 1200, '12:30', 'D1', ,'NRT');
insert into deparature values
('2017-12-21', 1530, '09:30', 'A2', ,'IGR');
insert into deparature values
('2017-12-21', 0820, '15:40', 'B4', ,'ICN');
insert into deparature values
('2017-12-21', 9999, '18:30', 'D3', ,'YVR');
insert into deparature values
('2017-12-21', 8787, '08:00', 'C9', ,'NAN');
insert into deparature values
('2017-12-21', 6060, '14:30', 'A5', ,'SCN');
insert into deparature values
('2017-12-21', 1000, '16:00', 'E4', ,'JFK');
insert into deparature values
('2017-12-21', 0090, '12:30', 'F6', ,'YVR');
insert into deparature values
('2017-12-21', 5678, '13:10', 'B3', ,'ACH');
insert into deparature values
('2017-12-21', 8765, '11:25', 'A6', ,'ICN');





insert into flight (fligthNum, duration, miles, arrDate, arrFSid, dptDate, dptFSid, pid) values




insert into reserveflight (confNum, flightNum) values
(925315, );
INSERT INTO reserveflight values
(299846,);
INSERT INTO reserveflight values
(365157, );
INSERT INTO reserveflight values
(768572, );
INSERT INTO reserveflight values
(420430, );
INSERT INTO reserveflight values
(052636, );
INSERT INTO reserveflight values
(330960, );
INSINSERT INTO reserveflight values
(691105, );
INSERT INTO reserveflight values
(499260, );
INSERT INTO reserveflight values
(178941, );
INSERT INTO reserveflight values
(234970, );
INSERT INTO reserveflight values
(231503, );
INSERT INTO reserveflight values
(792310, );



-- todo : add flightnum
insert into checkflight (email, flightNum) values
('hyungro@hotmail.com', );
INSERT INTO reservation VALUES
('chadol26@gmail.com', );
INSERT INTO reservation VALUES
('johnnykim@gmail.com', );
INSERT INTO reservation VALUES
('kes4135@gmail.com', );
INSERT INTO reservation VALUES
('najan73@yopmail.com', );
INSERT INTO reservation VALUES
('gordonjcp@hotmail.com', );
INSERT INTO reservation VALUES
('wsnyder@gmail.com', );
INSERT INTO reservation VALUES
('sakusha@yahoo.ca', );
INSERT INTO reservation VALUES
('drezet@me.com', )
INSERT INTO reservation VALUES
('mthurn@live.com', )
INSERT INTO reservation VALUES
('abcd@abcd.com', )
INSERT INTO reservation VALUES
('miyop@icloud.com', )
INSERT INTO reservation VALUES
('konit@icloud.com', )



insert into employee (eid, ename, email, address, age, SIN) values
(424040,"Jin King","elementum.at@gmail.com","839-5560 Accumsan Road", 30, '133-333-333');
insert into employee values
(029699,"Mira Parrish","tellus@hotamil.com","910-377 Ipsum Street", 40, '211-222-211');
insert into employee values
(179514,"Scarlett Dawson","Maecenas@fermentumvel.net","2138 Vivamus Street", 33, '001-023-998');
insert into employee values
(418519,"Kane Campbell","aliquam@magna.com","7612 Vitae Avenue", 45, '010-333-454');
insert into employee values
(694662,"Sylvia Oneal","auctor@icloud.com","3625 Eu Street", 37, '110-087-030');
insert into employee values
(745867,"Jakeem F. Winters","euismod@live.com","7887 Aliquam Avenue", 30, '122-002-890');
insert into employee values
(338952,"Nayda H. Stone","arcu@yahoo.com","4112 Non Road", 44, '322-578-012');
insert into employee values
(534931,"Tiger Davis","dolorque@gmail.com","426-220 Nec Road", 34, '120-342-222');
insert into employee values
(282887,"Fletcher U. Parks","enim@hotamil.com","3596 Enim Street", 37, '200-802-202');
insert into employee values
(057773,"Hasad Noble","pede@icloud.com","558-7682 Acadia Road", 46, '122-566-600');




insert into flightAttendant (eid, flyRestriction) values


insert into pilot (eid, lastFlyDate, medCertExpDate) values


insert into fligthCrewAssignment (eid, fligthNum) values