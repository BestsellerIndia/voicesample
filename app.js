var express = require("express");
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var multer = require('multer');
var fs = require('fs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))
var mongoose = require('mongoose');

global.Grid = require('gridfs-stream');

// parse application/json
app.use(bodyParser.json())
global.dbo = {};
app.use(express.static("myApp")); // myApp will be the same folder name.
app.get("/", function (req, res, next) {
    res.redirect("/");
});


const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');

var storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/mydb',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({
    storage
});


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
app.post('/api/employee/updateModule', function (req, res) {
    var db1 = dbo.db("mydb");
    console.log(req.body);
    db1.collection("employee").findOneAndUpdate({
            _id: ObjectId(req.body._id)
        }, {
            $set: {
                module: req.body.module + 1
            }
        }, {
            new: true
        },
        function (err, result) {
            console.log(result);
            res.send(result);
        }
    )
});
app.post('/api/employee/getModule', function (req, res) {
    var db1 = dbo.db("mydb");
    console.log(req.body);
    db1.collection("employee").findOne({
        "_id": ObjectId(req.body._id)
    }, function (err, result) {
        console.log(result);
        res.send(result);
    });
});
app.get('/files', function (req, res) {
    gfs.files.findOne({
        filename: '3110f245935bc7a086d05116d52fa296.wav'
    }, function (err, file) {
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
        // res.json(files);
    })
})


app.post('/api/voice/upload', upload.single('voiceFile'), function (req, res) {
    console.log(req.file);
    res.json({
        file: req.file
    })
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, {
    useNewUrlParser: true
}, function (err, db) {
    if (err) throw err;
    dbo = db;
});

const conn = mongoose.createConnection('mongodb://localhost:27017/mydb');
conn.once('open', function () {
    global.gfs = Grid(conn.db, mongoose.mongo);
    global.gfs.collection('uploads');
})
app.listen(process.env.PORT || 8080);
console.log("Server is Listening on port 8080");