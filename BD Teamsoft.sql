show databases;

create database transportadora;

drop table client;

drop table address;

use transportadora;

create table transportadora.client(
	id int auto_increment primary key not null,
	cnpj char(18) not null,
    razaosocial varchar(60) not null,
    nome varchar(45) not null,
    telefone varchar(14) not null,
    constraint unique_cnpj_client unique (CNPJ)
);

create table address(
	id int auto_increment primary key not null,
    endereco varchar(100) not null,
    numero varchar(5) not null,
    complemento varchar(100),
    bairro varchar(30) not null,
    cidade varchar(30) not null,
    estado Char(2) not null,
    cep char(8) not null,
    cid int not null,
    INDEX cid_idx (cid ASC) VISIBLE,
    constraint fk_address_client foreign key (cid) references client(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SELECT * FROM client;

SELECT * FROM address;

