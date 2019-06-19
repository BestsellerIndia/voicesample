var app = angular.module('app', ['ui.router']);
var bestConnectUrl = "https://mybestconnect.bestseller.com/Employees/login";
var voicePortalUrl = "http://localhost:8080/api/"

app.controller('loginCtrl', function ($scope, $http, $state) {
    if (!_.isEmpty($.jStorage.get("user"))) {
        $state.go("voice", {
            module: $.jStorage.get("user").module
        })
    }
    $scope.data = {
        Employee: {
            code: null,
            password: null,
            device_id: "",
            device_token: "",
            Platform: ""
        }
    }
    $scope.error = false;
    $scope.refreshError = function () {
        $scope.error = false;
    }
    $scope.login = function () {

        $http.post(bestConnectUrl, $scope.data)
            .then(function (data) {
                if (data.data && data.data.responseArray.message &&
                    data.data.responseArray.message.success == "You are logged in successfully.") {
                    $http.post(voicePortalUrl + "employee/save", {
                            code: data.data.responseArray.results.code,
                            name: data.data.responseArray.results.name
                        })
                        .then(function (data1) {
                            $.jStorage.set("user", data1.data.data);
                            $state.go('voice', {
                                module: data1.data.data.module
                            });
                        })
                } else {
                    $scope.error = true;
                }
            })
    }
});
app.controller('voiceCtrl', function ($scope, $http, $stateParams) {
    if (_.isEmpty($.jStorage.get("user"))) {
        $state.go("login");
    } else {
        $scope.user = $.jStorage.get("user");
    }

    $scope.logout = function () {
        $.jStorage.flush();
        $state.go("login");
    }
    var swiper = null;
    $http.get("./voice-script.json").then(function (data) {
        // console.log(data.data);
        $scope.script = data.data;
        $scope.scriptActive = 0;
        setTimeout(function () {
            swiper = new Swiper('.swiper-container', {
                spaceBetween: 30,
                centeredSlides: true,
                effect: 'cube',
                grabCursor: true,
                // loop: false,
                cubeEffect: {
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                },
                // autoplay: {
                //     delay: 2500,
                //     disableOnInteraction: false,
                //     // stopOnLast: true
                // },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
            swiper.on('reachEnd', function () {
                swiper.autoplay.stop();
            })
        }, 1000);
        $scope.setModule($stateParams.module);
    });
    $scope.setModule = function (mod) {
        $scope.mod = mod;
        var start = (mod - 1) * 80;
        var end = mod == 4 ? 338 : (start + 80);
        $scope.moduleWise = _.shuffle($scope.script.slice(start, end));
        // if (mod > 1) {
        //     swiper.slideTo(0, 1000, false);
        //     setTimeout(() => {
        //         swiper.autoplay.start();
        //     }, 1000);
        // }
        console.log($scope.moduleWise.length);
    }

    //webkitURL is deprecated but nevertheless
    // URL = window.URL || window.webkitURL;

    var gumStream; //stream from getUserMedia()
    var rec; //Recorder.js object
    var input; //MediaStreamAudioSourceNode we'll be recording

    // shim for AudioContext when it's not avb. 
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record


    $scope.pauseBtn = true;
    $scope.recordBtn = false;
    $scope.stopBtn = true;

    $scope.startRecording = function () {
        swiper.autoplay.start();
        var constraints = {
            audio: true,
            video: false
        }

        $scope.recordBtn = true;
        $scope.stopBtn = false;
        $scope.pauseBtn = false

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

            audioContext = new AudioContext();
            document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"

            gumStream = stream;
            input = audioContext.createMediaStreamSource(stream);
            rec = new Recorder(input, {
                numChannels: 1
            })
            rec.record()

            console.log("Recording started");

        }).catch(function (err) {

            $scope.recordBtn = false;
            $scope.stopbtn = true;
            $scope.pauseBtn = true;
        });
    }

    $scope.pauseRecording = function () {
        console.log("pauseButton clicked rec.recording=", rec.recording);
        if (rec.recording) {
            swiper.autoplay.stop();
            rec.stop();
            pauseButton.innerHTML = "Resume";
        } else {
            swiper.autoplay.start();
            rec.record()
            pauseButton.innerHTML = "Pause";

        }
    }

    $scope.stopRecording = function () {
        swiper.autoplay.stop();
        console.log("stopButton clicked");
        $scope.stopBtn = true;
        $scope.recordBtn = false;
        $scope.pauseBtn = true;
        pauseButton.innerHTML = "Pause";
        rec.stop();
        gumStream.getAudioTracks()[0].stop();
        rec.exportWAV(createDownloadLink);
    }

    function createDownloadLink(blob) {

        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        var li = document.createElement('li');
        var link = document.createElement('a');

        var filename = new Date().toISOString();
        au.controls = true;
        au.src = url;

        link.href = url;
        link.download = filename + ".wav";
        link.innerHTML = "Save to disk";
        li.appendChild(au);
        li.appendChild(document.createTextNode(filename + ".wav "))
        li.appendChild(link);
        recordingsList.appendChild(li);
    }
});
// Link all the JS Docs here

// Define all the routes below
app.config(function (
    $stateProvider,
    $urlRouterProvider
) {
    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "login.html",
            controller: "loginCtrl"
        })
        .state("voice", {
            url: "/voice/:module",
            templateUrl: "voice-sample.html",
            controller: "voiceCtrl"
        })

    $urlRouterProvider.otherwise("/login");
});