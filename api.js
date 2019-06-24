module.exports = function (app) {
    app.post('/api/employee/save', function (req, res) {
        console.log(req.body);
        dbo.collection("employee").findOneAndUpdate({
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
        console.log(req.body);
        dbo.collection("employee").findOneAndUpdate({
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
        dbo.collection("employee").findOne({
            "_id": ObjectId(req.body._id)
        }, function (err, result) {
            res.send(result);
        });
    });
    app.get('/api/readFiles/:filename', function (req, res) {
        gfs.files.findOne({
            filename: req.params.filename
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
    app.post('/api/employee/addVoiceSample', function (req, res) {
        dbo.collection("employee").findOneAndUpdate({
                _id: ObjectId(req.body._id)
            }, {
                $addToSet: {
                    file: {
                        path: req.body.file,
                        filename: req.body.filename
                    }
                }
            }, {
                new: true
            },
            function (err, result) {
                res.send("done");
            }
        )
    });
}