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

const conn = mongoose.createConnection(url + db, {
    useNewUrlParser: true
});
conn.once('open', function () {
    dbo = conn.db;
    global.gfs = Grid(conn.db, mongoose.mongo);
    global.gfs.collection('uploads');
})
app.listen(process.env.PORT || 8080);
console.log("Server is Listening on port 8080");
global.api = require("./api")(app);