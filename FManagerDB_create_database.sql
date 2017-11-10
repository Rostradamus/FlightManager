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
('chadol26@gmail.com', 2500);
insert into mileagemember values
('eomubc@gmail.com', 0);
