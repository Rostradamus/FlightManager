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

insert into passenger(email, password, pname, phone) values
('hyungro@hotmail.com', 'a49806102', 'Ro Lee', '778-681-7674');
insert into passenger(email, password, pname, phone) values
('test@test.com', 'a12345678', 'Test User', '123-456-7890');
insert into passenger(email, password, pname, phone) values
('abcd@abcd.com', 'a11111111', 'ABC DEF', '111-111-1111');
insert into passenger(email, password, pname, phone) values
('johnnykim@gmail.com', 'a49806102', 'John Kim', '604-436-4938');


insert into mileagemember values
('hyungro@hotmail.com', 400);
insert into mileagemember values
('johnnykim@gmail.com', 12200);