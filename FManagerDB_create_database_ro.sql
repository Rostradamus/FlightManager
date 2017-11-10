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

create table reservation (
    confNum INT(6),
    cost DOUBLE(7,2) NOT NULL,
    pointUsed TINYINT(1),
    medProtectionUsed TINYINT(1),
    email VARCHAR(255),
    PRIMARY KEY(confNum),
    FOREIGN KEY(email) references passenger(email)
);

create table seat (
    seatNum CHAR(3),
    isAvailable TINYINT(1) NOT NULL,
    stype CHAR(15),
    pid INT(4),
    confNum INT(6),
    PRIMARY KEY(seatNum, pid),
    FOREIGN KEY(stype) references seatType,
    FOREIGN KEY(pid) references airplane,
    FOREIGN KEY(confNum) references reservation
);

create table seatType (
    stype CHAR(15),
    price DOUBLE(7,2) NOT NULL,
    legroom DOUBLE(3,2),
    PRIMARY KEY(stype)
);

create table airplane (
    pid INT(4),
    pcode CHAR(5),
    ptype CHAR(15),
    numEconSeat INT(3) NOT NULL,
    numBusnSeat INT(3) NOT NULL,
    numFCSeat INT(3) NOT NULL,
    PRIMARY KEY(pid)
);

create table baggage (
    tag INT(10),
    btype CHAR(15),
    pid INT(4),
    confNum INT(6),
    PRIMARY KEY(tag),
    FOREIGN KEY(btype) references baggageType,
    FOREIGN KEY(pid) references airplane,
    FOREIGN KEY(confNum) references reservation
);

create table baggageType (
    btype CHAR(15),
    maxSize DOUBLE(4,2),
    maxWeight DOUBLE(4,2),
    fee DOUBLE(7,2) NOT NULL,
    PRIMARY KEY(btype)
);

create table airport (
    acode CHAR(3),
    aname CHAR(30),
    city CHAR(20) NOT NULL,
    country CHAR(20) NOT NULL,
    PRIMARY KEY(acode)
);

create table arrival (
    arrDate DATE,
    arrFSid INT(4),
    arrTime TIME NOT NULL,
    carousal INT(2),
    arrAirportCode CHAR(3),
    PRIMARY KEY(arrDate, arrFSid),
    FOREIGN KEY(arrAirportCode) references airport
);

create table departure (
    dptDate DATE,
    dptFSid INT(4),
    dptTime TIME NOT NULL,
    terminal CHAR(6),
    gate CHAR(3),
    dptAirportCode CHAR(3),
    PRIMARY KEY(dptDate, dptFSid),
    FOREIGN KEY(dptAirportCode) references airport
);

create table flight (
    flightNum INT(3),
    duration INT(5),
    miles DOUBLE(5,2),
    arrDate DATE,
    arrFSid INT(4),
    dptDate DATE,
    dptFSid INT(4),
    pid INT(4),
    PRIMARY KEY(flightNum),
    FOREIGN KEY(arrDate, arrFSid) references arrival,
    FOREIGN KEY(dptDate, dptFSid) references departure,
    FOREIGN KEY(pid) references airplane
);

create table reserveFlight (
    confNum INT(6),
    flightNum INT(3),
    PRIMARY KEY(confNum, flightNum),
    FOREIGN KEY(confNum) references reservation,
    FOREIGN KEY(flightNum) references flight
);

create table checkFlight (
    email VARCHAR(255),
    flightNum INT(3),
    PRIMARY KEY(email, flightNum),
    FOREIGN KEY(email) references passenger,
    FOREIGN KEY(flightNum) references flight
);

create table employee (
    eid INT(6),
    ename CHAR(20),
    email VARCHAR(255),
    address CHAR(30),
    age INT(3),
    SIN CHAR(9),
    PRIMARY KEY(eid),
    UNIQUE(email),
    UNIQUE(SIN)
);

create table flightAttendant (
    eid INT(6),
    flyRestriction TINYINT(1),
    PRIMARY KEY(eid),
    FOREIGN KEY(eid) references employee
);

create table pilot (
    eid INT(6),
    lastFlyDate DATE,
    medCertExpDate DATE,
    PRIMARY KEY(eid),
    FOREIGN KEY(eid) references employee
);

create table FlightCrewAssignment (
    eid INT(6),
    flightNum INT(3),
    PRIMARY KEY(eid, flightNum),
    FOREIGN KEY(eid) references employee,
    FOREIGN KEY(flightNum) references flight
);


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
(299846,826.04,0,1'chadol26@gmail.com');
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
(499260,543.46,0,0, 'drezet@me.com');
INSERT INTO reservation VALUES
(178941,939.12,1,0, 'mthurn@live.com');
INSERT INTO reservation VALUES
(234970,1028.38,0,0, 'abcd@abcd.com');
INSERT INTO reservation VALUES
(231503,666.21,0,1, 'miyop@icloud.com');
INSERT INTO reservation VALUES
(792310,595.07,1,1, 'konit@icloud.com');


INSERT INTO seat (seatNum, isAvailable, stype, pid, confNum) values
("698", 0, '', 0101, 925315);
INSERT INTO seat values
("118", 0, '', 9709, 299846);
INSERT INTO seat values
("406", 1, '', 9709, 365157);
INSERT INTO seat values
("550", 1, '', 3835, 768572);
INSERT INTO seat values
("677", 1, '', 0790, 420430);
INSERT INTO seat values
("002", 0, '', 9960, 052636);
INSERT INTO seat values
("153", 1, '', 2415, 330960);
INSERT INTO seat values
("601", 0, '', 2415, 691105);
INSERT INTO seat values
("428", 1, '', 3521, 499260);
INSERT INTO seat values
("944", 1, '', 3518, 178941);
INSERT INTO seat values
("985", 0, '', 6787, 234970);
INSERT INTO seat values
("931", 1, '', 6787, 231503);
INSERT INTO seat values
("888", 1, '', 6787, 792310);

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
INSERT INTO seat valuessa
(0310310982, 'checked', 6787, 231503);
INSERT INTO seat values
(2502502500, 'carry-on', 6787, 792310);

insert into airport(acode, aname, city, country) values
('YVR', 'Vancouver International Airport', 'Vancouver', 'Canada');
insert into airport values
('YCD', 'Vancouver - Nanaimo Airport', 'Vancouver', 'Canada');
insert into airport values
('ICN', 'Incheon International Airport', 'Incheon', 'South Korea');
insert into airport values
('JFK', 'John F Kennedy International Airport', 'New York', 'US');
insert into airport values
('SCN', 'Saarbrucken Airport', 'Saarbrucken', 'Germany');
insert into airport values
('ACH', 'St Gallen', 'Altenrhein', 'Switzerland');
insert into airport values
('NRT', 'New Tokyo International Airport', 'Tokyo', 'Japan');
insert into airport values
('IGR', 'Iguazu International Airport', 'Puerto Iguazú', 'Argentina');
insert into airport values
('NAN', 'Nadi International Airport', 'Nadi', 'Fiji');
insert into airport values
('NKG', 'Nanjing Lukou International Airport', 'Nanjing', 'China');
