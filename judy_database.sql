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
insert into passenger(email, password, pname, phone, dateofbirth, address) values
('drezet@me.com', 'a18929323', 'Mathias Littlem', '778-909-0000', '1985-07-29', '46 Walter Street, Surrey');
insert into passenger(email, password, pname, phone, dateofbirth) values
('miyop@icloud.com', 'a99991222', 'Eddie Randolph', '778-800-9988', '1985-03-03');
insert into passenger(email, password, pname, phone, dateofbirth, address) values
('konit@icloud.com', 'a12121212', 'Angela Walker', '604-826-1001', '1987-11-08', '6005 Walter Gage Road, Vancouver');
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
('35A', 0, 'economy', 0101, 925315);
INSERT INTO seat values
('41F', 0, 'economy', 9709, 299846);
INSERT INTO seat values
('30D', 1, 'economy', 9709, 365157);
INSERT INTO seat values
('16B', 1, 'business', 3835, 768572);
INSERT INTO seat values
('15E', 1, 'business', 0790, 420430);
INSERT INTO seat values
('12A', 0, 'business', 9960, 052636);
INSERT INTO seat values
('3B', 1, 'first-class', 2415, 330960);
INSERT INTO seat values
('47I', 0, 'economy', 2415, 691105);
INSERT INTO seat values
('30E', 1, 'economy', 3521, 499260);
INSERT INTO seat values
('1B', 1, 'first-class', 3518, 178941);
INSERT INTO seat values
('12D', 0, 'business', 6787, 234970);
INSERT INTO seat values
('30A', 1, 'economy', 6787, 231503);
INSERT INTO seat values
('33J', 1, 'economy', 8888, 792310);
INSERT INTO seat values
('10C', 1, 'business', 5959, 792310);




insert into seattype (stype, price, legroom) values
('first-class', 15000.00, 150);
insert into seattype values
('business', 8000.00, 100);
insert into seattype values
('economy', 1200.00, 50);




insert into airplane (pid, pcode, ptype, numEconSeat, numBusnSeat, numFCSeat) values
(0101, 'AC', 'Boeing 767-800', 200, 30, 10);
insert into airplane values
(9709, 'AC', 'Airbus A330-300', 340, 60, 14);
insert into airplane values
(3835, 'AC', 'Boeing 787-8', 100, 10, 0);
insert into airplane values
(0790, 'AC', 'Airbus A330-300', 250, 46, 10);
insert into airplane values
(9960, 'AC', 'Boeing 767-300', 80, 6, 0);
insert into airplane values
(2415, 'AC', 'Boeing 787-9', 400, 60, 20);
insert into airplane values
(3521, 'AC', 'Boeing 767-300', 200, 40, 10);
insert into airplane values
(3518, 'AC', 'Boeing 777-200', 300, 50, 12);
insert into airplane values
(6787, 'AC', 'Airbus A300-330', 450, 70, 26);
insert into airplane values
(8888, 'AC', 'Boeing 767-0', 450, 70, 26);
insert into airplane values
(5959, 'AC', 'Airbus A300-000', 450, 70, 26);




insert into baggage(tag, btype, pid, confNum) values
(1111100000, 'carry-on', 0101, 925315);
INSERT INTO baggage values
(8888888888, 'carry-on', 9709, 299846);
INSERT INTO baggage values
(4040404040, 'checked', 9709, 365157);
INSERT INTO baggage values
(5500111111, 'checked', 3835, 768572);
INSERT INTO baggage values
(9009999876, 'checked', 0790, 420430);
INSERT INTO baggage values
(2100022222, 'checked', 9960, 052636);
INSERT INTO baggage values
(1234987653, 'carry-on', 2415, 330960);
INSERT INTO baggage values
(0908070980, 'carry-on', 2415, 691105);
INSERT INTO baggage values
(5789000000, 'checked', 3521, 499260);
INSERT INTO baggage values
(9554944949, 'checked', 3518, 178941);
INSERT INTO baggage values
(5895895895, 'checked', 6787, 234970);
INSERT INTO baggage values
(0310310982, 'checked', 6787, 231503);
INSERT INTO baggage values
(2502502500, 'carry-on', 6787, 792310);



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
('JFK', 'John F Kennedy Airport', 'New York', 'US')
insert into airport values
('SCN', 'Saarbrucken Airport', 'Saarbrucken', 'Germany')
insert into airport values
('ACH', 'St Gallen', 'Altenrhein', 'Switzerland')
insert into airport values
('NRT', 'New Tokyo Airport', 'Tokyo', 'Japan')
insert into airport values
('IGR', 'Iguazu International Airport', 'Puerto Iguazú', 'Argentina')
insert into airport values
('NAN', 'Nadi International Airport', 'Nadi', 'Fiji')
insert into airport values
('NKG', 'Nanjing Lukou Airport', 'Nanjing', 'China')



insert into arrival(arrDate, arrFSid, arrTime, carousel, arrAirportCode) values
('2017-12-21', 1200, '12:30', 12, 'YVR');
insert into arrival values
('2018-05-01', 1530, '10:30', 05, 'YVR');
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
('2018-02-23', 0090, '12:30', 13, 'YVR');
insert into arrival values
('2017-12-21', 5678, '15:10', 04, 'NKG');
insert into arrival values
('2018-05-21', 8765, '14:25', 15, 'YCD');


insert into deparature(dptDate, dptFSid, dptTime, terminal, gate, dptAirportCode) values
('2017-12-21', 1000, '8:30', 'main', 'D40','NRT');
insert into deparature values
('2018-04-30', 5130, '09:30', 'main', 'A12','IGR');
insert into deparature values
('2017-11-15', 2008, '6:40', 'main', 'B23','ICN');
insert into deparature values
('2017-01-02', 9919, '16:30', 'south', 'G3' ,'YVR');
insert into deparature values
('2017-11-24', 7887, '23:00', 'main', 'C19','NAN');
insert into deparature values
('2018-07-10', 2340, '01:30', 'south', 'G1' ,'SCN');
insert into deparature values
('2018-02-23', 1110, '13:00', 'main', 'E86','JFK');
insert into deparature values
('2018-02-23', 0890, '10:50', 'main', 'F26','YVR');
insert into deparature values
('2017-12-21', 5611, '09:10', 'south', 'G3','ACH');
insert into deparature values
('2018-05-21', 8865, '8:25', 'main', 'A16','ICN');




insert into flight (fligthNum, duration, miles, arrDate, arrFSid, dptDate, dptFSid, pid) values
(123, 4, 1909.25, '2017-12-21', 1200, '2017-12-21', 1000, 0101)
insert into flight  values
(900, 13, 6347.50, '2018-05-01', 1530, '2018-04-30', 5130, 9709)
insert into flight  values
(070, 9, 4387.50, '2017-11-15', 0820, '2017-11-15', 2008, 0790)
insert into flight  values
(565, 3.3, 1608.75, '2017-12-21', 1200, '2017-12-21', 5611, 0101)
insert into flight  values
(111, 2, 1050.00, '2017-12-21', 9999, '2017-01-02', 9919, 8888)
insert into flight  values
(606, 9, 4300.25, '2017-11-25', 8787, '2017-11-24', 7887, 3518)
insert into flight  values
(246, 13, 6207.50, '2018-07-10', 6060, '2018-07-10', 2340, 8888)
insert into flight  values
(369, 3, 1620.87, '2018-02-23', 1000, '2018-02-23', 1110, 3521)
insert into flight  values
(480, 1.6, 742.38, '2017-12-21', 0090, '2017-02-23', 0890, 9960)
insert into flight  values
(721, 6, 1580.75, '2017-12-21', 8765, '2018-05-21', 8865, 2415)




insert into reserveflight (confNum, flightNum) values
(925315, 123);
INSERT INTO reserveflight values
(299846,123);
INSERT INTO reserveflight values
(365157, 900);
INSERT INTO reserveflight values
(768572, 565);
INSERT INTO reserveflight values
(420430, 111);
INSERT INTO reserveflight values
(052636, 480);
INSERT INTO reserveflight values
(330960, 721);
INSERT INTO reserveflight values
(691105, 565);
INSERT INTO reserveflight values
(499260, 070);
INSERT INTO reserveflight values
(178941, 246);
INSERT INTO reserveflight values
(234970, 606);
INSERT INTO reserveflight values
(231503, 900);
INSERT INTO reserveflight values
(792310, 070);



insert into checkflight (email, flightNum) values
('hyungro@hotmail.com', 123);
INSERT INTO reservation VALUES
('chadol26@gmail.com', 123);
INSERT INTO reservation VALUES
('johnnykim@gmail.com', 900);
INSERT INTO reservation VALUES
('kes4135@gmail.com', 565);
INSERT INTO reservation VALUES
('najan73@yopmail.com', 111);
INSERT INTO reservation VALUES
('gordonjcp@hotmail.com', 480);
INSERT INTO reservation VALUES
('wsnyder@gmail.com', 721);
INSERT INTO reservation VALUES
('sakusha@yahoo.ca', 565);
INSERT INTO reservation VALUES
('drezet@me.com', 070);
INSERT INTO reservation VALUES
('mthurn@live.com', 246);
INSERT INTO reservation VALUES
('abcd@abcd.com', 606);
INSERT INTO reservation VALUES
('miyop@icloud.com', 900);
INSERT INTO reservation VALUES
('konit@icloud.com', 070);


insert into employee (eid, ename, email, address, age, SIN) values
(424040,'Jin King','elementum.at@gmail.com','839-5560 Accumsan Road', 30, '133333333');
insert into employee values
(029699,'Mira Parrish','tellus@hotamil.com','910-377 Ipsum Street', 40, '211222211');
insert into employee values
(179514,'Scarlett Dawson','Maecenas@fermentumvel.net','2138 Vivamus Street', 33, '001023998');
insert into employee values
(418519,'Kane Campbell','aliquam@magna.com','7612 Vitae Avenue', 45, '010333454');
insert into employee values
(694662,'Sylvia Oneal','auctor@icloud.com','3625 Eu Street', 37, '110087030');
insert into employee values
(745867,'Jakeem F. Winters','euismod@live.com','7887 Aliquam Avenue', 30, '122002890');
insert into employee values
(338952,'Nayda H. Stone','arcu@yahoo.com','4112 Non Road', 44, '322578012');
insert into employee values
(534931,'Tiger Davis','dolorque@gmail.com','426-220 Nec Road', 34, '120342222');
insert into employee values
(282887,'Fletcher U. Parks','enim@hotamil.com','3596 Enim Street', 37, '200802202');
insert into employee values
(057773,'Hasad Noble','pede@icloud.com','558-7682 Acadia Road', 46, '122566600');
insert into employee values
(151713,'Jaimie Yai','jyai@gmail.com','5959 Student Union Blouvevard', 35, '121566611');
insert into employee values
(001700,'Nug McDonald','mcdonald@gmail.com','1800 Stone Drive', 40, '799500611');
insert into employee values
(510307,'Allen H. Gomez','mollis@nullemail.com','574-683 Hendrerit Ave', 30, '132200777');
insert into employee values
(229061,'Tanek X. Mayer','eu@ataugue.org','1386 Leo. Avenue', 40, '001100111');
insert into employee values
(985924,'Bryar M. Greer','vmagna@nam.net','563 Eget Street', 28, '321456789');
insert into employee values
(041732,'Mufutau N. Barker','Fusce@oyahoo.com','930-6929 Velit. St.', 33, '678901234');
insert into employee values
(876257,'Rina F. Haynes','lorem@email.ca','928-3745 Primis Road', 45, '100782487');
insert into employee values
(420399,'Simon I. Gutierrez','putate@email.ca','197-5341 Blandit Av.', 33, '249680369');
insert into employee values
(105090,'Buckmin Hampton','placet@hotmail.com','7638 Curabitur Avenue', 48, '872010800');
insert into employee values
(960097,'Prescott Vasquez','tempor@ante.co.uk','959-7851 Ultricies Street', 25,'450293102');
insert into employee values
(009128, 'Randall Hood','dolor@gmail.com','942-6449 Facilisis Rd.', 38,'467012210');
insert into employee values
(581794,'Malcolm I. Byer','nisi@ipsum.edu','242-4032 Cras Ave', 25, '145167178');
insert into employee values
(130307,'Roth Alvarado','faucibus@gmail.org','6314 Penatibus Rd.', 35, '167190170');



insert into flightAttendant (eid, flyRestriction) values
(424040, 1);
insert into fligthAttendant values
(418519, 1);
insert into flightAttendant values
(694662, 0);
insert into flightAttendant values
(745867, 1);
insert into flightAttendant values
(338952, 1);
insert into flightAttendant values
(534931, 0);
insert into flightAttendant values
(282887, 1);
insert into flightAttendant values
(510307, 1);
insert into flightAttendant values
(229061, 1);
insert into flightAttendant values
(985924, 1);
insert into flightAttendant values
(581794, 1);
insert into flightAttendant values
(130307, 1);




insert into pilot (eid, lastFlyDate, medCertExpDate) values
(029699, '2017-11-01', '2018-10-10');
insert into pilot values
(179514, '2016-12-10', '2017-05-06');
insert into pilot values
(057773, '2017-07-15', '2019-05-25');
insert into pilot values
(151713, '2017-03-04', '2018-01-12');
insert into pilot values
(001700, '2017-10-21', '2018-09-26');
insert into pilot values
(041732, '2017-11-01', '2018-10-10');
insert into pilot values
(876257, '2017-07-28', '2019-05-01');
insert into pilot values
(420399, '2017-09-15', '2019-03-25');
insert into pilot values
(105090, '2017-04-01', '2017-08-25');
insert into pilot values
(960097, '2017-10-21', '2018-09-26');
insert into pilot values
(009128, '2017-10-21', '2018-09-26');


insert into fligthCrewAssignment (eid, fligthNum) values
(424040, 123 );
insert into fligthCrewAssignment values
(418519, 900);
insert into fligthCrewAssignment values
(745867, 070);
insert into fligthCrewAssignment values
(338952, 606)
insert into fligthCrewAssignment values
(282887, 246);
insert into fligthCrewAssignment values
(029699, 565);
insert into fligthCrewAssignment values
(057773, 721);
insert into fligthCrewAssignment values
(151713, 480);
insert into fligthCrewAssignment values
(001700, 111);
insert into fligthCrewAssignment values
(041732, 123)
insert into fligthCrewAssignment values
(876257, 900)
insert into fligthCrewAssignment values
(420399, 070)
insert into fligthCrewAssignment values
(960097, 606)
insert into fligthCrewAssignment values
(179514, 246)
insert into fligthCrewAssignment values
(009128, 369)
insert into fligthCrewAssignment values
(510307, 721);
insert into fligthCrewAssignment values
(229061, 070);
insert into fligthCrewAssignment values
(985924, 369);
insert into fligthCrewAssignment values
(581794, 480);
insert into fligthCrewAssignment values
(130307, 111);