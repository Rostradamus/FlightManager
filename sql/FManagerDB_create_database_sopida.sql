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
    terminal CHAR(20),
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
insert into passenger(email, password, pname, phone, dateofbirth) values
('eomubc@gmail.com', 'a32905127', 'Haeun Eom', '778-828-0091', '1995-03-20');


insert into mileagemember values
('hyungro@hotmail.com', 400);
insert into mileagemember values
('johnnykim@gmail.com', 12200);
insert into mileagemember values
('chadol26@gmail.com', 2500);
insert into mileagemember values
('eomubc@gmail.com', 0);
