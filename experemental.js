var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Lophophore'
 });

con.connect(function(err) {

app.use(express.static(__dirname + "/views"));    
    
   app.set("view engine", "pug");
    
    app.set('views', './views');
    
/*app.post("/register", function (req, res) { 
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
     age = req.body.userAge;
     seks = req.body.Seks;
    //res.sendfile('index.html');
});
*/
    
app.get('/', function(req, res) {
  res.sendfile('views/index.html');
});      


app.get('/add', function(req, res) {
  res.sendfile('views/add');
});

app.get('/hand', function(req, res) {
  res.sendfile('views/hand.html');
});


app.use('/', bodyParser.urlencoded({
    extended: true
}));

      
app.post('/adder', function(req, res, next)
{
      if (err) throw err;
    con.query("SELECT COUNT(*) AS count FROM ClothesNames", function (err, rows, fields) {
    if (err) throw err;
    count = rows[0].count;
        count = count + 1;
    var ClothesNamesMass = {
        name: req.body.name,
        src: req.body.src,
        imgsrc: req.body.imgsrc
    }

    var TagAgeMass = {
        age: req.body.Age,
        cid: count
    }
           
    var TagEventMass = {
        event: req.body.Event,
        cid: count
    }
    
    var TagGenderMass = {
        gender: req.body.Gender,
        cid: count
    }
    var TagStyleMass = {
        style: req.body.Style,
        cid: count
    }
                
        con.query("INSERT INTO ClothesNames SET ?", ClothesNamesMass, function (err, rows, fields) {
              if (err) throw err;
            con.query("INSERT INTO TagAge SET ?", TagAgeMass, function (err, rows, fields) {
                  if (err) throw err;
             con.query("INSERT INTO TagEvent SET ?", TagEventMass, function (err, rows, fields) {
                   if (err) throw err;
            con.query("INSERT INTO TagGender SET ?", TagGenderMass, function (err, rows, fields) {
                  if (err) throw err;
            con.query("INSERT INTO TagStyle SET ?", TagStyleMass, function (err, rows, fields) {
             if (err) throw err;
        });
        });
        });
        });
        });
        });
    //con.query("INSERT INTO ClothesNames TagAge (age), TagEvent (event), TagGender (gender), TagStyle (style) SET ClothesNames.name = ? AND ClothesNames.src = ? AND ClothesNames.imgsrc = ? AND TagAge.age = ? AND TagGender.gender = ? AND TagStyle.style = ? AND TagEvent.event = ?", [req.body.name, req.body.src, req.body.imgsrc, req.body.Age, req.body.Gender, req.body.style, req.body.event] , function (err, rows, fields) {
   // if (err) throw err;
   
   // });
        res.sendfile('views/add.html');
  });   
      
app.post('/handler', function(req, res, next) {
 
  if (err) throw err;
    con.query("SELECT COUNT(*) AS count FROM ClothesNames, TagAge, TagGender WHERE ClothesNames.id = TagAge.cid AND ClothesNames.id = TagGender.cid AND age = ? AND gender = ?", [req.body.Age, req.body.Gender], function (err, rows, fields) {
    if (err) throw err;
    count = rows[0].count;
        console.log(count);
            if (count == 0) {
       res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(
               '<!DOCTYPE html>'
              +'<html>'
        +'<head>'
        +'<meta charset="utf-8">'
        +'<title>'+'Мы не смогли подобрать ни одной вещи!</title>'
        +'</head>'
        +'<body>'
        +  '<p text-align="center"></p>'
    +'<h2>The main page of Lophophore service</h2>'
    +`<button onclick="location.href = '/hand'">index</button>`
    +  `<button onclick="location.href = '/add'">add</button>`
        +'</body>'
        +'</html>'
          )
   //     res.end(JSON.stringify(fields));
        res.end();  
    }
   // console.log(count + " Кол-во");
  con.query("SELECT name, clothPoints, src, imgsrc, age, style, event, gender FROM ClothesNames, TagAge, TagEvent, TagGender, TagStyle WHERE ClothesNames.id = TagAge.cid AND ClothesNames.id = TagEvent.cid AND ClothesNames.id = TagGender.cid AND ClothesNames.id = TagStyle.cid AND age = ? AND gender = ? ", [req.body.Age, req.body.Gender], function (err, result, fields) {
    if (err) throw err;
     
    //  console.log(result);
      var popa = JSON.parse(JSON.stringify(result));
 if (popa.clothPoints == null){
          console.log("Hello^_^");
      }
      else{
          var stroka="";
          //var clothPoints = [];
          for (var i = 0; i < count; i++) {              
              console.log(popa[i].name + " Имя и очкo " + popa[i].clothPoints);
          if (popa[i].event == req.body.Event){
              popa[i].clothPoints += 5;
          }
          
           if (popa[i].style == req.body.Style){
               popa[i].clothPoints += 1;
          }
        
    }
          console.log(popa)
         // console.log(popa.clothPoints);
    for (var i = 0; i < count-1; i++)
     { for (var j = 0; j < count-1-i; j++)
        { if (popa[j+1].clothPoints < popa[j].clothPoints)
           { var t = popa[j+1]; popa[j+1] = popa[j]; popa[j] = t; }
        }
     }                 
            for (var c = 0; c < count; c ++){
           //console.log(popa[c].name + " Имя и очки " + popa[c].clothPoints);
           stroka = '<img src='+popa[c].imgsrc+' width="360" height="360"> <p>'+popa[c].name+" Событие: "+popa[c].event+" Возраст: "+popa[c].age +"0 Стиль: "+ popa[c].style +" Пол: "+popa[c].gender + '</p><p>'+popa[c].src+'</p>' + stroka
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