DROP TABLE IF EXISTS tabledata;
CREATE TABLE IF NOT EXISTS tabledata (
	id serial NOT NULL,
	details varchar(255) NOT NULL,
	tablename varchar(255) NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT tabledata_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS errorlog;
CREATE TABLE IF NOT EXISTS errorlog (
	id serial NOT NULL,
	details varchar(255) NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT errorlog_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
DROP TABLE IF EXISTS logging;
CREATE TABLE IF NOT EXISTS logging (
	id serial NOT NULL,
	details varchar(255) NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT errorlog_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS counties;
CREATE TABLE IF NOT EXISTS counties(
	id serial NOT NULL,
	name varchar(50) NOT NULL,    
    geom geometry(multilinestring,3765),
	CONSTRAINT counties_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS jls;
CREATE TABLE IF NOT EXISTS jls(
	id serial NOT NULL,
	name varchar(50) NOT NULL,    
    geom geometry(multilinestring,3765),
	CONSTRAINT jls_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS settlements;
CREATE TABLE IF NOT EXISTS settlements(
	id serial NOT NULL,
	name varchar(50) NOT NULL,    
    geom geometry(multilinestring,3765),
	CONSTRAINT settlements_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS locboard;
CREATE TABLE IF NOT EXISTS locboard(
	id serial NOT NULL,
	name varchar(50) NOT NULL,    
    geom geometry(multilinestring,3765),
	CONSTRAINT locboard_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS router;
CREATE TABLE IF NOT EXISTS router (
	id serial NOT NULL,
	idcounties integer NULL,
	idjls integer NULL,
	idsettlements integer NULL,
    idlocboard integer NULL,
	CONSTRAINT router_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS transactions;
CREATE TABLE IF NOT EXISTS transactions (
	id serial NOT NULL,
	details varchar(255) NOT NULL,
	idcontrols integer NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT transactions_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS controls;
CREATE TABLE IF NOT EXISTS controls (
	id serial NOT NULL,
	details varchar(255) NOT NULL,
	idapplication integer NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT controls_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS authorizations;
CREATE TABLE IF NOT EXISTS authorizations (
	id serial NOT NULL,
	idrouter integer NOT NULL,
	iduser integer NOT NULL,
	idapplication integer NOT NULL,
	read numeric(1) NOT NULL,
	update numeric(1) NOT NULL,
	insert numeric(1) NOT NULL,
	delete numeric(1) NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT authorizations_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS applications;
CREATE TABLE IF NOT EXISTS applications (
	id serial NOT NULL,
	details varchar(255) NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP(6) NOT NULL,
	created TIMESTAMP(6) NOT NULL,
	CONSTRAINT applications_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);
​
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
	id serial NOT NULL,
	name varchar(60) NOT NULL,
	surname varchar(60) NOT NULL,
	email varchar(60) NOT NULL,
	password varchar(60) NOT NULL,
	idupdated integer NOT NULL,
	idcreated integer NOT NULL,
	updated TIMESTAMP NOT NULL,
	created TIMESTAMP NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);

alter table applications add column idrouter integer ;
alter table controls add column idrouter integer ;
alter table transactions add column idrouter integer ;
​
ALTER TABLE authorizations ADD CONSTRAINT authorizations_fk0 FOREIGN KEY (idrouter) REFERENCES router(id);
ALTER TABLE authorizations ADD CONSTRAINT authorizations_fk1 FOREIGN KEY (iduser) REFERENCES users(id);
ALTER TABLE authorizations ADD CONSTRAINT authorizations_fk2 FOREIGN KEY (idapplication) REFERENCES applications(id);
ALTER TABLE authorizations ADD CONSTRAINT authorizations_fk3 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE authorizations ADD CONSTRAINT authorizations_fk4 FOREIGN KEY (idcreated) REFERENCES users(id);
​
ALTER TABLE applications ADD CONSTRAINT applications_fk0 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE applications ADD CONSTRAINT applications_fk1 FOREIGN KEY (idcreated) REFERENCES users(id);
ALTER TABLE applications ADD CONSTRAINT applications_fk02 FOREIGN KEY (idrouter) REFERENCES router(id);
​
ALTER TABLE tabledata ADD CONSTRAINT tabledata_fk0 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE tabledata ADD CONSTRAINT tabledata_fk1 FOREIGN KEY (idcreated) REFERENCES users(id);
​
ALTER TABLE errorlog ADD CONSTRAINT errorlog_fk0 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE errorlog ADD CONSTRAINT errorlog_fk1 FOREIGN KEY (idcreated) REFERENCES users(id);
​
ALTER TABLE settlements ADD CONSTRAINT settlements_fk0 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE settlements ADD CONSTRAINT settlements_fk1 FOREIGN KEY (idcreated) REFERENCES users(id);
​
ALTER TABLE controls ADD CONSTRAINT controls_fk0 FOREIGN KEY (idapplication) REFERENCES applications(id);
ALTER TABLE controls ADD CONSTRAINT controls_fk1 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE controls ADD CONSTRAINT controls_fk2 FOREIGN KEY (idcreated) REFERENCES users(id);
ALTER TABLE controls ADD CONSTRAINT controls_fk3 FOREIGN KEY (idrouter) REFERENCES router(id);
​
ALTER TABLE transactions ADD CONSTRAINT transactions_fk0 FOREIGN KEY (idcontrols) REFERENCES controls(id);
ALTER TABLE transactions ADD CONSTRAINT transactions_fk1 FOREIGN KEY (idupdated) REFERENCES users(id);
ALTER TABLE transactions ADD CONSTRAINT transactions_fk2 FOREIGN KEY (idcreated) REFERENCES users(id);
ALTER TABLE transactions ADD CONSTRAINT transactions_fk3 FOREIGN KEY (idrouter) REFERENCES router(id);