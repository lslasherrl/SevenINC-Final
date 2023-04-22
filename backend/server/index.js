const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "leo123456",
  database: "SevenINC"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("SQL Connected!");
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/api/teste", (req, res) => {
    con.query("SELECT * FROM funcionarios", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.json({ data: result});
      });
});

app.post("/api/insertworker", (req, res) => {
  console.log("feijao" ,req.body);
  const {Name, Document, Email, Birth_date, Salary} = req.body;
  var sql = `insert into funcionarios (
        Name,Document,Email,Birth_date,Salary,created_at ) values
        ('${Name}','${Document}','${Email}','${Birth_date}',${Salary},sysdate())`;
  con.query(sql, function (err, result) {
    if (err) {
      res.json({ message: err });
      return
    };
    res.json({ message: "Inserido com Sucesso" });
  });
});

app.put("/api/updateworker", (req, res) => {
  console.log("erorsabonete", req.body);  
  const {ID, Email, Salary} = req.body;
    var sql = `update funcionarios set
    email = '${Email}',
    salary = ${Salary}
    where id = ${ID}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json({ message: "Hello from server!" });
    console.log(result.affectedRows + " Alterados com Sucesso");
  });
});

app.delete("/api/deleteworker/:id", (req, res) => {
    console.log("feijao", req.params);
    var sql = `DELETE FROM funcionarios WHERE id = ${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json({ message: "Hello from server!" });
    console.log("ID deletado com Sucesso" + result.affectedRows);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
