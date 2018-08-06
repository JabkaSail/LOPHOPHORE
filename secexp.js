var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
var request = require("request"),
    cheerio = require("cheerio");

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Lophophore'
 });

con.connect(function(err) {

app.use(express.static(__dirname + "/views"));    
    
    app.set("view engine", "hbs");
    
/*app.post("/register", function (req, res) { 
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
     age = req.body.userAge;
     seks = req.body.Seks;
    //res.sendfile('index.html');
});
*/
    
app.get('/', function(req, res) {
  res.sendfile('index.html');
});      


app.get('/add', function(req, res) {
  res.sendfile('views/add.html');
}); 



app.use('/', bodyParser.urlencoded({
    extended: true
}));
con.query("SELECT COUNT(*) AS count FROM ClothesNames", function (err, rows, fields) {
    if (err) throw err;
    count = rows[0].count;
   // console.log(count + " Кол-во");
app.post('/adder', function(req, res, next) {
   if (err) throw err;
    var namez = {
        name: req.body.name,
        src: req.body.src,
        imgsrc: req.body.imgsrc
    }
    var bost = {
        age: req.body.Age,
        event: req.body.Event,
        gender: req.body.Gender,
        style: req.body.Style,
        cid: count,
    }
    con.query("INSERT INTO ClothesNames SET ?", namez, function (err, rows, fields) {
    if (err) throw err;
         con.query("INSERT INTO ClothesTags SET ?", bost, function (err, rows, fields) {
    if (err) throw err;
    });
    });
});
  });     
app.post('/handler', function(req, res, next) {
  if (err) throw err;
    con.query("SELECT COUNT(*) AS count FROM ClothesNames, ClothesTags WHERE ClothesNames.id = ClothesTags.cid AND age = ? AND gender = ?", [req.body.Age, req.body.Gender], function (err, rows, fields) {
    if (err) throw err;
    count = rows[0].count;
  con.query("SELECT name, clothPoints, src, imgsrc, age, style, event, gender FROM ClothesNames, ClothesTags WHERE ClothesNames.id = ClothesTags.cid AND age = ? AND gender = ?", [req.body.Age, req.body.Gender], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
      if (result == [])
      {
          res.render("result.hbs", {
        h2: "Нет подходящей одежды"
    });
      }
      else {
      var popa = JSON.parse(JSON.stringify(result));
         console.log(count)
          var stroka="";
          //var clothPoints = [];
          for (var i = 0; i < count; i++) {      
           console.log( 'HELLO BLIN  ' +popa[i].clothPoints);
          if (popa[i].event == req.body.Event){
              popa[i].clothPoints += 5;
          }
          
           if (popa[i].style == req.body.Style){
               popa[i].clothPoints += 1;
          }
        
    }
          
          for (var o = 0; o < count; o++){
          for (var p = 0; p < count; p++){
                if (popa[p].clothPoints>popa[p+1].clothPoints) {
                var max = popa[p].clothPoints;
                popa[p].clothPoints = popa[p+1].clothPoints;
                popa[p+1].clothPoints = max;            
      }       
}
             stroka = '<img src='+popa[o].imgsrc+' width="360" height="360"> <p>'+popa[o].name+'</p><p>'+popa[o].src+'</p>' + stroka
}
   res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(
               '<!DOCTYPE html>'
              +'<html>'
        +'<head>'
        +'<meta charset="utf-8">'
        +'<title>'+'Мы подобрали несколько вещей - '+count+'</title>'
        +'</head>'
        +'<body>'
        + stroka
        +'</body>'
        +'</html>'
          )
   //     res.end(JSON.stringify(fields));
        res.end();
}

});  
});
});
});

console.log('Сервер стартовал!');
app.listen(8080);