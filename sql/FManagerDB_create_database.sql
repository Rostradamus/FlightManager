drop database FlightManager;
create database FlightManager;


use FlightManager;


-- TODO: password might have to be CHAR(60) BINARY if we have to encrypt
create table passenger (
    email VARCHAR(255),
    password CHAR(60) NOT NULL,
    pname CHAR(20) NOT NULL,
    phone CHAR(17) NOT NULL,
    dateofbirth DATE,
    address VARCHAR(255),
    PRIMARY KEY(email),
    UNIQUE(phone)
);

create table mileagemember (
    email VARCHAR(255),
    mpoint INT(10),
    PRIMARY KEY(email),
    FOREIGN KEY(email) references passenger(email)
    ON DELETE CASCADE ON UPDATE CASCADE
);

create table reservation (
    confNum INT(6),
    cost DOUBLE(7,2) NOT NULL,
    pointUsed TINYINT(1),
    medProtectionUsed TINYINT(1),
    email VARCHAR(255),
    PRIMARY KEY(confNum),
    FOREIGN KEY(email) references passenger(email)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

create table seatType (
    stype CHAR(15),
    price DOUBLE(8,2) NOT NULL,
    legroom DOUBLE(8,2),
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

create table airport (
    acode CHAR(3),
    aname CHAR(60),
    city CHAR(20) NOT NULL,
    country CHAR(20) NOT NULL,
    PRIMARY KEY(acode)
);

create table seat (
    seatNum CHAR(3),
    isAvailable TINYINT(1) NOT NULL,
    stype CHAR(15),
    pid INT(4),
    confNum INT(6),
    PRIMARY KEY(seatNum, pid),
    FOREIGN KEY(stype) references seatType(stype)
    ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY(pid) references airplane(pid)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(confNum) references reservation(confNum)
    ON DELETE SET NULL ON UPDATE CASCADE
);

create table baggageType (
    btype CHAR(15),
    maxSize DOUBLE(8,2),
    maxWeight DOUBLE(8,2),
    fee DOUBLE(7,2) NOT NULL,
    PRIMARY KEY(btype)
);

create table baggage (
    tag CHAR(10),
    btype CHAR(15),
    pid INT(4),
    confNum INT(6),
    PRIMARY KEY(tag),
    FOREIGN KEY(btype) references baggageType(btype)
    ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY(pid) references airplane(pid)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(confNum) references reservation(confNum)
    ON DELETE CASCADE ON UPDATE NO ACTION
);

create table arrival (
    arrDate DATE,
    arrFSid INT(4) NOT NULL,
    arrTime TIME NOT NULL,
    carousel INT(2),
    arrAirportCode CHAR(3),
    PRIMARY KEY(arrDate, arrFSid),
    FOREIGN KEY(arrAirportCode) references airport(acode)
    ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE(arrFSid, arrAirportCode)
);

create table departure (
    dptDate DATE,
    dptFSid INT(4),
    dptTime TIME NOT NULL,
    terminal CHAR(20),
    gate CHAR(3),
    dptAirportCode CHAR(3),
    PRIMARY KEY(dptDate, dptFSid),
    FOREIGN KEY(dptAirportCode) references airport(acode)
    ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE(dptFSid, dptAirportCode)
);

create table flight (
    flightNum INT(3),
    duration INT(5),
    miles DOUBLE(8,2),
    arrDate DATE,
    arrFSid INT(4),
    dptDate DATE,
    dptFSid INT(4),
    pid INT(4) UNIQUE,
    PRIMARY KEY(flightNum),
    FOREIGN KEY(arrDate, arrFSid) references arrival(arrDate, arrFSid)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(dptDate, dptFSid) references departure(dptDate, dptFSid)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(pid) references airplane(pid)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

create table reserveFlight (
    confNum INT(6),
    flightNum INT(3),
    PRIMARY KEY(confNum, flightNum),
    FOREIGN KEY(confNum) references reservation(confNum)
    ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY(flightNum) references flight(flightNum)
    ON DELETE CASCADE ON UPDATE CASCADE
);

create table checkFlight (
    email VARCHAR(255),
    flightNum INT(3),
    PRIMARY KEY(email, flightNum),
    FOREIGN KEY(email) references passenger(email)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(flightNum) references flight(flightNum)
    ON DELETE CASCADE ON UPDATE CASCADE
);

create table employee (
    eid INT(6),
    ename CHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password CHAR(60) NOT NULL,
    address CHAR(30),
    age INT(3) NOT NULL,
    SIN CHAR(9),
    PRIMARY KEY(eid),
    UNIQUE(email),
    UNIQUE(SIN)
);

create table flightAttendant (
    eid INT(6),
    flyRestriction TINYINT(1),
    PRIMARY KEY(eid),
    FOREIGN KEY(eid) references employee(eid)
    ON DELETE CASCADE ON UPDATE CASCADE
);

create table pilot (
    eid INT(6),
    lastFlyDate DATE NOT NULL,
    medCertExpDate DATE NOT NULL,
    PRIMARY KEY(eid),
    FOREIGN KEY(eid) references employee(eid)
    ON DELETE CASCADE ON UPDATE CASCADE
);

create table airlineClerk (
    eid INT(6),
    airline CHAR(60),
    PRIMARY KEY(eid),
    FOREIGN KEY(eid) references employee(eid)
    ON DELETE CASCADE ON UPDATE CASCADE
);


create table FlightCrewAssignment (
    eid INT(6),
    flightNum INT(3),
    PRIMARY KEY(eid, flightNum),
    FOREIGN KEY(eid) references employee(eid)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(flightNum) references flight(flightNum)
    ON DELETE CASCADE ON UPDATE CASCADE
);

insert into passenger(email, password, pname, phone, dateofbirth, address) values
('hyungro@hotmail.com', 'a49806102', 'Ro Lee', '778-681-7674', '1992-04-29', '6375 Boundary Road, Vancouver');
insert into passenger(email, password, pname, phone, address) values
('test@test.com', 'a12345678', 'Test User', '123-456-7890', 'UBC');
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
insert into passenger(email, password, pname, phone) values
('jamiejeon96@gmail.com', 'wjswlals', 'Jamie Jeon', '778-898-0527');


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
(299846,1826.04,0,1, 'chadol26@gmail.com');
INSERT INTO reservation VALUES
(365157,1703.01,0,1, 'johnnykim@gmail.com');
INSERT INTO reservation VALUES
(768572,1294.99,0,1, 'kes4135@gmail.com');
INSERT INTO reservation VALUES
(420430,1833.98,1,1, 'najan73@yopmail.com');
INSERT INTO reservation VALUES
(052636,1271.95,1,0, 'gordonjcp@hotmail.com');
INSERT INTO reservation VALUES
(330960,1410.30,0,0, 'wsnyder@gmail.com');
INSERT INTO reservation VALUES
(691105,1338.00,0,0, 'sakusha@yahoo.ca');
INSERT INTO reservation VALUES
(499260,15430.00,0,0, 'drezet@me.com');
INSERT INTO reservation VALUES
(178941,9390.12,1,0, 'mthurn@live.com');
INSERT INTO reservation VALUES
(234970,10280.38,0,0, 'abcd@abcd.com');
INSERT INTO reservation VALUES
(231503,1200.00,0,1, 'miyop@icloud.com');
INSERT INTO reservation VALUES
(792310, 1800.07,1,1, 'konit@icloud.com');
INSERT INTO reservation VALUES
(740302, 1595.07,1,1, 'konit@icloud.com');
INSERT INTO reservation VALUES
(109020, 12000.00,1,1, 'mthurn@live.com');
INSERT INTO reservation VALUES
(738393, 8100.50,1,1, 'sakusha@yahoo.ca');
INSERT INTO reservation VALUES
(920834, 8100.50,1,1, 'hyungro@hotmail.com');
INSERT INTO reservation VALUES
(920805, 1200.00, 1,1, 'hyungro@hotmail.com');



insert into airplane (pid, pcode, ptype, numEconSeat, numBusnSeat, numFCSeat) values
(0101, 'AC', 'Boeing 767-800', 200, 30, 10);
insert into airplane values
(4693, 'AC', 'Boeing 767-800', 200, 30, 10);
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
insert into airplane values
(3737, 'AC', 'Boeing 767-0', 450, 70, 26);
insert into airplane values
(1737, 'AC', 'Airbus A300-000', 450, 70, 26);


insert into seattype (stype, price, legroom) values
('first-class', 15000.00, 150);
insert into seattype values
('business', 8000.00, 100);
insert into seattype values
('economy', 1200.00, 50);


INSERT INTO seat (seatNum, isAvailable, stype, pid, confNum) values
('35A', 0, 'economy', 0101, 925315);
INSERT INTO seat values
('3B', 1, 'first-class', 0101, null);
INSERT INTO seat values
('41F', 1, 'economy', 9709, null);
INSERT INTO seat values
('30D', 0, 'economy', 9709, 365157);
INSERT INTO seat values
('16B', 0, 'business', 3835, 768572);
INSERT INTO seat values
('15E', 0, 'business', 0790, 420430);
INSERT INTO seat values
('12A', 0, 'business', 9960, 052636);
INSERT INTO seat values
('3B', 0, 'first-class', 2415, 330960);
INSERT INTO seat values
('47I', 0, 'economy', 2415, 691105);
INSERT INTO seat values
('30E', 0, 'economy', 3521, 499260);
INSERT INTO seat values
('1B', 0, 'first-class', 3518, 178941);
INSERT INTO seat values
('12D', 0, 'business', 6787, 234970);
INSERT INTO seat values
('30A', 0, 'economy', 6787, 231503);
INSERT INTO seat values
('33J', 0, 'economy', 8888, 792310);
INSERT INTO seat values
('10C', 0, 'business', 5959, 792310);
INSERT INTO seat values
('30E', 0, 'economy', 2415, 740302);
INSERT INTO seat values
('5A', 0, 'first-class', 3521, 109020);
INSERT INTO seat values
('14B', 0, 'business', 0101, 738393);
INSERT INTO seat values
('22A', 0, 'business', 3521, 920834);
INSERT INTO seat values
('48D', 0, 'economy', 3521, 920805);

INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('5A', 1, 'first-class', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3B', 1, 'first-class', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('14B', 1, 'business', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('17A', 1, 'business', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('10A', 1, 'business', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('48D', 1, 'economy', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('50C', 1, 'economy', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('29A', 1, 'economy', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('31D', 1, 'economy', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('34A', 1, 'economy', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('41B', 1, 'economy', 4693);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('37B', 1, 'economy', 4693);

INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('5A', 1, 'first-class', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3B', 1, 'first-class', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('14B', 1, 'business', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('17A', 1, 'business', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('10A', 1, 'business', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('48D', 1, 'economy', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('50C', 1, 'economy', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('29A', 1, 'economy', 3737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('31D', 1, 'economy', 3737);

INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1A', 1, 'first-class', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1B', 1, 'first-class', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('9B', 1, 'business', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11C', 1, 'business', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('7D', 1, 'business', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('8C', 1, 'business', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('43A', 1, 'economy', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('59D', 1, 'economy', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('60A', 1, 'economy', 1737);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('31D', 1, 'economy', 1737);


INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('35B', 1, 'economy', 0101);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('41A', 1, 'economy', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30E', 1, 'economy', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('16C', 1, 'business', 3835);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('15F', 1, 'business', 0790);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('12B', 1, 'business', 9960);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3C', 1, 'first-class', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('47J', 1, 'economy', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30F', 1, 'economy', 3521);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1C', 1, 'first-class', 3518);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('12E', 1, 'business', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30B', 1, 'economy', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('33K', 1, 'economy', 8888);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('10D', 1, 'business', 5959);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('35C', 1, 'economy', 0101);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('41B', 1, 'economy', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30F', 1, 'economy', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('16D', 1, 'business', 3835);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('15G', 1, 'business', 0790);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('12C', 1, 'business', 9960);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3D', 1, 'first-class', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('47K', 1, 'economy', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30G', 1, 'economy', 3521);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1D', 1, 'first-class', 3518);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('12F', 1, 'business', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30C', 1, 'economy', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('33A', 1, 'economy', 8888);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('10E', 1, 'business', 5959);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('15B', 1, 'business', 0101);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11A', 1, 'business', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('10E', 1, 'business', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('36C', 1, 'economy', 3835);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('35F', 1, 'economy', 0790);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('32B', 1, 'economy', 9960);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('33C', 1, 'economy', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('4A', 1, 'first-class', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3B', 1, 'first-class', 3521);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11C', 1, 'business', 3518);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('32E', 1, 'economy', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('10B', 1, 'business', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('13C', 1, 'business', 8888);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1D', 1, 'first-class', 5959);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('15C', 1, 'business', 0101);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11B', 1, 'business', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3C', 1, 'first-class', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1D', 1, 'first-class', 3835);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('35G', 1, 'economy', 0790);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('42C', 1, 'economy', 9960);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('33D', 1, 'economy', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('17C', 1, 'business', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('1A', 1, 'first-class', 3521);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11D', 1, 'business', 3518);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('42F', 1, 'economy', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('23C', 1, 'business', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('37D', 1, 'economy', 8888);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('36F', 1, 'economy', 5959);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('17A', 1, 'business', 5959);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('22I', 1, 'economy', 0101);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('40J', 1, 'economy', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('15B', 1, 'business', 9709);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('4D', 1, 'first-class', 3835);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11C', 1, 'business', 0790);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('35J', 1, 'economy', 9960);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('29J', 1, 'economy', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('33G', 1, 'economy', 2415);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('3A', 1, 'first-class', 3521);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11F', 1, 'business', 3518);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('4C', 1, 'first-class', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('9C', 1, 'business', 6787);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('11C', 1, 'business', 8888);
INSERT INTO seat(seatNum, isAvailable, stype, pid) values
('30E', 1, 'economy', 5959);



insert into baggageType(btype, maxSize, maxWeight, fee) values
('carry-on', 118, 10, 0);
insert into baggageType(btype, maxSize, maxWeight, fee) values
('checked', 158, 23, 25);


insert into baggage(tag, btype, pid, confNum) values
('1111100000', 'carry-on', 0101, 925315);
INSERT INTO baggage values
('8888888888', 'carry-on', 9709, 299846);
INSERT INTO baggage values
('4040404040', 'checked', 9709, 365157);
INSERT INTO baggage values
('5500111111', 'checked', 3835, 768572);
INSERT INTO baggage values
('9009999876', 'checked', 0790, 420430);
INSERT INTO baggage values
('2100022222', 'checked', 9960, 052636);
INSERT INTO baggage values
('1234987653', 'carry-on', 2415, 330960);
INSERT INTO baggage values
('0908070980', 'carry-on', 2415, 691105);
INSERT INTO baggage values
('5789000000', 'checked', 3521, 499260);
INSERT INTO baggage values
('9554944949', 'checked', 3518, 178941);
INSERT INTO baggage values
('5895895895', 'checked', 6787, 234970);
INSERT INTO baggage values
('0310310982', 'checked', 6787, 231503);
INSERT INTO baggage values
('2502502500', 'carry-on', 6787, 792310);
INSERT INTO baggage values
('2502310220', 'carry-on', 2415, 740302);
INSERT INTO baggage values
('1192039459', 'carry-on', 3521, 109020);
INSERT INTO baggage values
('0092837458', 'carry-on', 0101, 738393);
INSERT INTO baggage values
('7758443945', 'carry-on', 3521, 920834);
INSERT INTO baggage values
('1287221938', 'carry-on', 3521, 920805);





insert into airport(acode, aname, city, country) values
('YVR', 'Vancouver International Airport', 'Vancouver', 'Canada');
insert into airport values
('YCD', 'Vancouver - Nanaimo Airport', 'Vancouver', 'Canada');
insert into airport values
('ICN', 'Incheon International Airport', 'Incheon', 'South Korea');
insert into airport values
('JFK', 'John F Kennedy Airport', 'New York', 'US');
insert into airport values
('SCN', 'Saarbrucken Airport', 'Saarbrucken', 'Germany');
insert into airport values
('ACH', 'St Gallen', 'Altenrhein', 'Switzerland');
insert into airport values
('NRT', 'New Tokyo Airport', 'Tokyo', 'Japan');
insert into airport values
('IGR', 'Iguazu International Airport', 'Puerto Iguazú', 'Argentina');
insert into airport values
('NAN', 'Nadi International Airport', 'Nadi', 'Fiji');
insert into airport values
('NKG', 'Nanjing Lukou Airport', 'Nanjing', 'China');

insert into airport values
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'US');
insert into airport values
('ORD', 'O Hare International Airport', 'Chicago', 'US');
insert into airport values
('BAH', 'Bahrain International', 'Manama', 'Bahrain');




insert into arrival(arrDate, arrFSid, arrTime, carousel, arrAirportCode) values
('2017-12-21', 1200, '12:30', 12, 'YVR');
insert into arrival values
('2017-12-22', 1209, '02:30', 42, 'YVR');
insert into arrival values
('2017-12-21', 7398, '04:45', 17, 'YVR');
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
insert into arrival values
('2018-01-10', 9212, '20:20', 12, 'ICN');
insert into arrival values
('2018-01-11', 2012, '16:00', 12, 'JFK');



insert into departure(dptDate, dptFSid, dptTime, terminal, gate, dptAirportCode) values
('2017-12-21', 1000, '8:30', 'main', 'D40','NRT');
insert into departure values
('2017-12-21', 1001, '22:30', 'main', 'E23','NRT');
insert into departure values
('2017-12-21', 0989, '12:45', 'main', 'F7','NRT');
insert into departure values
('2018-04-30', 5130, '09:30', 'main', 'A12','IGR');
insert into departure values
('2017-11-15', 2008, '6:40', 'main', 'B23','ICN');
insert into departure values
('2018-01-02', 9919, '16:30', 'south', 'G3' ,'YVR');
insert into departure values
('2017-11-24', 7887, '23:00', 'main', 'C19','NAN');
insert into departure values
('2018-07-10', 2340, '01:30', 'south', 'G1' ,'SCN');
insert into departure values
('2018-02-23', 1110, '13:00', 'main', 'E86','JFK');
insert into departure values
('2018-02-23', 0890, '10:50', 'main', 'F26','YVR');
insert into departure values
('2017-12-21', 5611, '09:10', 'south', 'G3','ACH');
insert into departure values
('2018-05-21', 8865, '8:25', 'main', 'A16','ICN');
insert into departure values
('2018-01-10', 9990, '15:50', 'main', 'A30','YVR');
insert into departure values
('2018-01-11', 2102, '06:00', 'main', 'B12','YVR');




insert into flight (flightNum, duration, miles, arrDate, arrFSid, dptDate, dptFSid, pid) values
(123, 4, 1909.25, '2017-12-21', 1200, '2017-12-21', 1000, 0101);
insert into flight  values
(585, 4, 1909.25, '2017-12-22', 1209, '2017-12-21', 1001, 3521);
insert into flight  values
(908, 4, 1909.25, '2017-12-21', 7398, '2017-12-21', 0989, 4693);
insert into flight  values
(900, 13, 6347.50, '2018-05-01', 1530, '2018-04-30', 5130, 9709);
insert into flight  values
(070, 9, 4387.50, '2017-11-15', 0820, '2017-11-15', 2008, 0790);
insert into flight  values
(565, 3.3, 1608.75, '2017-12-21', 1200, '2017-12-21', 5611, 3835);
insert into flight  values
(111, 2, 1050.00, '2018-01-02', 9999, '2018-01-02', 9919, 8888);
insert into flight  values
(606, 9, 4300.25, '2017-11-25', 8787, '2017-11-24', 7887, 3518);
insert into flight  values
(246, 13, 6207.50, '2018-07-10', 6060, '2018-07-10', 2340, 6787);
insert into flight  values
(369, 3, 1620.87, '2018-02-23', 1000, '2018-02-23', 1110, 5959);
insert into flight  values
(480, 1.6, 742.38, '2018-02-23', 0090, '2018-02-23', 0890, 9960);
insert into flight  values
(721, 6, 1580.75, '2018-05-21', 8765, '2018-05-21', 8865, 2415);
insert into flight  values
(888, 5, 1000.75, '2018-01-10', 9212, '2018-01-10', 9990, 3737);
insert into flight  values
(012, 10, 5500.75, '2018-01-11', 2012, '2018-01-11', 2102, 1737);




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
INSERT INTO reserveflight values
(740302,  721);
INSERT INTO reserveflight values
(109020, 369);
INSERT INTO reserveflight values
(738393, 012);
INSERT INTO reserveflight values
(920834, 585);
INSERT INTO reserveflight values
(920805, 888);



insert into checkflight (email, flightNum) values
('hyungro@hotmail.com', 123);
INSERT INTO checkflight VALUES
('chadol26@gmail.com', 123);
INSERT INTO checkflight VALUES
('johnnykim@gmail.com', 900);
INSERT INTO checkflight VALUES
('kes4135@gmail.com', 565);
INSERT INTO checkflight VALUES
('najan73@yopmail.com', 111);
INSERT INTO checkflight VALUES
('gordonjcp@hotmail.com', 480);
INSERT INTO checkflight VALUES
('wsnyder@gmail.com', 721);
INSERT INTO checkflight VALUES
('sakusha@yahoo.ca', 565);
INSERT INTO checkflight VALUES
('drezet@me.com', 070);
INSERT INTO checkflight VALUES
('mthurn@live.com', 246);
INSERT INTO checkflight VALUES
('abcd@abcd.com', 606);
INSERT INTO checkflight VALUES
('miyop@icloud.com', 900);
INSERT INTO checkflight VALUES
('konit@icloud.com', 070);
INSERT INTO checkflight VALUES
('konit@icloud.com', 721);
INSERT INTO checkflight VALUES
('mthurn@live.com',  369);
INSERT INTO checkflight VALUES
('sakusha@yahoo.ca',  246);
INSERT INTO checkflight VALUES
('hyungro@hotmail.com', 585);
INSERT INTO checkflight VALUES
('hyungro@hotmail.com', 900);



insert into employee (eid, ename, email, password, address, age, SIN) values
(424040,'Jin King','flight@gmail.com', '1','839-5560 Accumsan Road', 30, '133333333');
insert into employee values
(029699,'Mira Parrish','tellus@hotmail.com', '1','910-377 Ipsum Street', 40, '211222211');
insert into employee values
(179514,'Scarlett Dawson','Maecenas@fermentumvel.net', '1','2138 Vivamus Street', 33, '001023998');
insert into employee values
(418519,'Kane Campbell','aliquam@magna.com', '1','7612 Vitae Avenue', 45, '010333454');
insert into employee values
(694662,'Sylvia Oneal','auctor@icloud.com', '1','3625 Eu Street', 37, '110087030');
insert into employee values
(745867,'Jakeem F. Winters','euismod@live.com', '1','7887 Aliquam Avenue', 30, '122002890');
insert into employee values
(338952,'Nayda H. Stone','arcu@yahoo.com', '1','4112 Non Road', 44, '322578012');
insert into employee values
(534931,'Tiger Davis','dolorque@gmail.com', '1','426-220 Nec Road', 34, '120342222');
insert into employee values
(282887,'Fletcher U. Parks','enim@hotamil.com', '1','3596 Enim Street', 37, '200802202');
insert into employee values
(057773,'Hasad Noble','pede@icloud.com', '1','558-7682 Acadia Road', 46, '122566600');
insert into employee values
(151713,'Jaimie Yai','jyai@gmail.com', '1','5959 Student Union Blouvevard', 35, '121566611');
insert into employee values
(001700,'Nug McDonald','mcdonald@gmail.com', '1','1800 Stone Drive', 40, '799500611');
insert into employee values
(510307,'Allen H. Gomez','mollis@nullemail.com', '1','574-683 Hendrerit Ave', 30, '132200777');
insert into employee values
(229061,'Tanek X. Mayer','eu@ataugue.org', '1','1386 Leo. Avenue', 40, '001100111');
insert into employee values
(985924,'Bryar M. Greer','vmagna@nam.net', '1','563 Eget Street', 28, '321456789');
insert into employee values
(041732,'Mufutau N. Barker','Fusce@oyahoo.com', '1','930-6929 Velit. St.', 33, '678901234');
insert into employee values
(876257,'Rina F. Haynes','lorem@email.ca', '1','928-3745 Primis Road', 45, '100782487');
insert into employee values
(420399,'Simon I. Gutierrez','putate@email.ca', '1','197-5341 Blandit Av.', 33, '249680369');
insert into employee values
(105090,'Buckmin Hampton','placet@hotmail.com', '1','7638 Curabitur Avenue', 48, '872010800');
insert into employee values
(960097,'Prescott Vasquez','tempor@ante.co.uk', '1','959-7851 Ultricies Street', 25,'450293102');
insert into employee values
(009128, 'Randall Hood','dolor@gmail.com', '1','942-6449 Facilisis Rd.', 38,'467012210');
insert into employee values
(581794,'Malcolm I. Byer','nisi@ipsum.edu', '1','242-4032 Cras Ave', 25, '145167178');
insert into employee values
(130307,'Roth Alvarado','faucibus@gmail.org', '1', '6314 Penatibus Rd.', 35, '167190170');
insert into employee values
(020304, 'Colin Powell', 'colin123@hotmail.com', '1','901-3829 Ante, Av.', 38, '333333333');
insert into employee values
(908070, 'Macey Freeman', 'mfmf@gmail.com', '1', '#898-2920 Egestas Street', 40, '693856250');
insert into employee values
(560123, 'Vernon Lester', 'lester@icloud.com','1', '#780-7548 Mauris, Ave',29, '411412873');
insert into employee values
(345789, 'Yardley Calhoun', 'memske1@gmail.com', '1', '8688 Amet St.', 33, '638984192');
insert into employee values
(965098, 'Nerea Hull', 'commaaco@hotmail.com', '1', '338-440 Eleifend St.', 28, '558175471');
insert into employee values
(203041,'Jane Francis', 'janene@hotmail.com', '1', '7990 Donec Rd.', 33, '333541592');
insert into employee values
(918273, 'Gail A. Little', 'pogail@icloud.com','1', '3743 Dapibus St.', 35, '335756752');
insert into employee values
(012389, 'Ian Mullins', 'mullinin@gmail.com', '1', '#710-6154 Tincidunt Ave', 37, '080943557');
insert into employee values
(928272, 'Beck Key', 'keywow@gmail.com','1', '16356 Nec, Rd.', 42, '902442952');
insert into employee values
(101012, 'Iola X. Kennedy', 'kennedy@gmail.com', '1', '6659 Ut Street',25, '963637593');
insert into employee values
(111111, 'Admin', 'admin@admin.com', '1', 'Admin Street',25, '999999999');



insert into flightAttendant (eid, flyRestriction) values
(424040, 0);
insert into flightAttendant values
(418519, 0);
insert into flightAttendant values
(694662, 0);
insert into flightAttendant values
(745867, 0);
insert into flightAttendant values
(338952, 0);
insert into flightAttendant values
(534931, 0);
insert into flightAttendant values
(282887, 0);
insert into flightAttendant values
(510307, 0);
insert into flightAttendant values
(229061, 0);
insert into flightAttendant values
(985924, 0);
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


insert into airlineClerk values
(12389, 'Air Canada'),
(20304, 'Air Canada'),
(101012, 'Air Canada'),
(203041, 'Air Canada'),
(560123, 'Air Canada'),
(918273, 'Air Canada'),
(965098, 'Air Canada'),
(111111, 'Admin');


insert into flightCrewAssignment (eid, flightNum) values
(424040, 123);
insert into flightCrewAssignment values
(418519, 900);
insert into flightCrewAssignment values
(745867, 070);
insert into flightCrewAssignment values
(338952, 606);
insert into flightCrewAssignment values
(282887, 246);
insert into flightCrewAssignment values
(029699, 565);
insert into flightCrewAssignment values
(057773, 721);
insert into flightCrewAssignment values
(151713, 480);
insert into flightCrewAssignment values
(001700, 111);
insert into flightCrewAssignment values
(041732, 123);
insert into flightCrewAssignment values
(876257, 900);
insert into flightCrewAssignment values
(420399, 070);
insert into flightCrewAssignment values
(029699, 246);
insert into flightCrewAssignment values
(009128, 369);
insert into flightCrewAssignment values
(510307, 721);
insert into flightCrewAssignment values
(229061, 070);
insert into flightCrewAssignment values
(985924, 369);
insert into flightCrewAssignment values
(581794, 480);
insert into flightCrewAssignment values
(130307, 111);



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
    where e.eid = fc.eid and p.eid = e.eid;