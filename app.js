global.express = require("express");
global.multer = require('multer');
global.app = express();
global.bodyParser = require('body-parser');
global.ObjectId = require('mongodb').ObjectID;
global.async = require('async');
global.multer = require('multer');
global.fs = require('fs');
// global.MongoClient = require('mongodb').MongoClient;
global.url = "mongodb://127.0.0.1:27017/";
global.db = "voice-portal";

var cert1 = fs.readFileSync('cert.crt');
var key1 = fs.readFileSync('key.pem');
var ca1 = fs.readFileSync('RootCA.crt');

var options = {
    pfx: fs.readFileSync('cert_new1.pfx'),
    // cert: cert1,
    // key: key1,
    // passphrase: 'n6Cow2gSEiBvj5rbon7EXbigKt',
    passphrase: 'dRduvnJGmiEO1tklnJ0gN4clwymklX7NuwlPEcPB5',
    ca: ca1
    // rejectUnauthorized: true,
    // requestCert: true,
    //agent: false
};
const spawn = require('child_process').spawn;
const pipe = spawn('mongod', ['--dbpath=/data/db', '--port', '27017'])

pipe.stdout.on('data', function (data) {
    console.log(data.toString('utf8'));
    const pipe1 = spawn('mongo', []);
    pipe1.stdout.on('data', function (data) {
        console.log(data.toString('utf8'));
        const conn = mongoose.createConnection(url + db, {
            useNewUrlParser: true
        });
        conn.once('open', function () {
            console.log(conn.db);
            dbo = conn.db;
            global.gfs = Grid(conn.db, mongoose.mongo);
            global.gfs.collection('uploads');
        })
    })
    pipe1.stderr.on('data', (data) => {
        console.log(data.toString('utf8'));
    });

    pipe1.on('close', (code) => {
        console.log('Process exited with code: ' + code);
    });
});

pipe.stderr.on('data', (data) => {
    console.log(data.toString('utf8'));
});

pipe.on('close', (code) => {
    console.log('Process exited with code: ' + code);
});

// var http = require('http');
// http.createServer(server).listen(port, function() {
//     console.log('HTTP Server running on  port: %d', port);
// });


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '110mb'
}))
global.mongoose = require('mongoose');

global.Grid = require('gridfs-stream');

// parse application/json
app.use(bodyParser.json({
    limit: '50mb'
}))
global.dbo = {};
app.use(express.static("myApp")); // myApp will be the same folder name.
app.get("/", function (req, res, next) {
    res.redirect("/");
});

global.crypto = require('crypto');
global.path = require('path');
global.GridFsStorage = require('multer-gridfs-storage');

global.storage = new GridFsStorage({
    url: url + db,
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
global.upload = multer({
    storage
});

// MongoClient.connect(url, {
//     useNewUrlParser: true
// }, function (err, db) {
//     if (err) throw err;
//     dbo = db;
// });


// app.listen(process.env.PORT || 8080);

var https = require('https');
https.createServer(options, app).listen(process.env.PORT || 8080, function () {
    console.log('HTTPS Server running on port: %d', process.env.PORT || 8080);
    // console.log("Server is Listening on port 8080");
});
global.api = require("./api")(app);