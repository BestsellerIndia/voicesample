var app = require("./app.js")

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