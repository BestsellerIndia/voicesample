(function () {
    'use strict';

    angular.module('recorderDemo', [
            'angularAudioRecorder'
        ])
        .controller('DemoController', function ($scope, $timeout) {
            console.log("Loaded");

        })
        .config(function (recorderServiceProvider) {
            navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
  });
            recorderServiceProvider
                .forceSwf(window.location.search.indexOf('forceFlash') > -1)
                .setSwfUrl('lib/recorder.swf')
                .withMp3Conversion(true);
        });

})();