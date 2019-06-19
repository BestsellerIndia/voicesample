var express = require("express");
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse application/json
app.use(bodyParser.json())
global.dbo = {};
app.use(express.static("myApp")); // myApp will be the same folder name.
app.get("/", function (req, res, next) {
    res.redirect("/");
});

// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });
// var upload = multer({ storage : storage}).single('userPhoto');

app.post('/api/employee/save', function (req, res) {
    var db1 = dbo.db("mydb");
    console.log(req.body);
    db1.collection("employee").findOneAndUpdate({
            'code': req.body.code
        }, {
            $setOnInsert: {
                code: req.body.code,
                name: req.body.name,
                module: 1
            }
        }, {
            new: true,
            upsert: true
        },
        function (err, result) {
            console.log(result);
            res.send({
                error: err,
                data: result.value ? result.value : {
                    _id: result.lastErrorObject.upserted,
                    code: req.body.code,
                    name: req.body.name,
                    module: 1
                }
            });
        }
    )
});
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, {
    useNewUrlParser: true
}, function (err, db) {
    if (err) throw err;
    dbo = db;
});
app.listen(process.env.PORT || 8080);
console.log("Server is Listening on port 8080");