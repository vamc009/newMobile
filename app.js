(function () {

    var serverURL = "http://stage-newsletter.bge.com", // IMPORTANT: This URL needs to be accessible from your phone for testing.
        $scroller = $('.scroller'),

        // Get List of images from server
        getFeed = function () {
			console.log("App started, upload server is "+serverURL);
            $scroller.empty();
            $.ajax({url: serverURL + "/images", type: "GET"}).done(function (data) {
                /*var l = data.length;
                for (var i = 0; i < l; i++) {
                    $scroller.append('<img src="' + serverURL + '/' + data[i].fileName + '"/>');
                }*/
				$scroller.append(data);
				//$scroller.append('<img src="http://stage-newsletter.bge.com/images/AR1234IPAD_-122.33715_47.62783333333334_test-ipadupload.jpg"/>');
            });
        },

        // Upload image to server
        upload = function (imageURI) {
			console.log("Preparing Upload");
            var ft = new FileTransfer(),
                options = new FileUploadOptions();

            options.fileKey = "file";
            options.fileName = new Date().getTime() + imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType = "image/jpeg";
            options.params = { 
                "ARID": "MA1234", "LON" : "-74.044636", "LAT": "40.689060"
			};

			console.log("Starting Upload to " + serverURL + "/SafetyAR.asmx/UploadImage");
			
            ft.upload(imageURI, serverURL + "/SafetyAR.asmx/UploadImage",
                function (e) {
					console.log("Code = " + r.responseCode);
					console.log("Response = " + r.response);
					console.log("Sent = " + r.bytesSent);
                    getFeed();
                },
                function (e) {
                    alert("Upload failed");
                }, options);
        },

        // Take a picture using the camera or select one from the library
        takePicture = function (e) {
            var options = {
                quality: 45,
                targetWidth: 1000,
                targetHeight: 1000,
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA
            };

            navigator.camera.getPicture(
                function (imageURI) {
                    console.log(imageURI);
                    upload(imageURI);
                },
                function (message) {
					console.log(message);
                    // We typically get here because the use canceled the photo operation. Fail silently.
                }, options);

            return false;

        };

    $('.camera-btn').on('click', takePicture);

    getFeed();

}());
