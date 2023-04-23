Primeiramente obrigado pela oportunidade, o projeto contem 2 pastas backend/frontend devem ser colocadas em uma unica pasta e ser iniciada.
Banco de dados feito com MYSQL Feito como pedido pelo Documento enviado para mim fiz pensando em uma pessoa autorizada fazendo o cadastro de um funcionario no banco da empresa.

Codigo do MySQL:
create database SevenINC; 
use SevenINC; 
CREATE TABLE Funcionarios ( ID int not null auto_increment primary key, Name varchar(10) not null, Document varchar(11) not null, Email varchar(320) not null, Birth_date date not null, Salary decimal not null, created_at date not null ); 
commit; 
select * from funcionarios; 
update funcionarios set email = '', salary = 1 where id = 1; insert into funcionarios ( Name,Document,Email,Birth_date,Salary,created_at ) values ('Leonardo','00000000011','seujose@gmail.com','2012-12-12',1000,sysdate());
