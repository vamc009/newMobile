
// Make sure BGE namespace exists
if(BGE == null)
	var BGE = {};

BGE.Form = {};

var alertMessage;

//$( '#homepage' ).live( 'pageinit',function(event){
//	getAlertsMsgSP();
	//setAlertsMsgSP();
//});



$( 'div[data-role=page]' ).live( 'pageinit',function(event){

if(alertMessage!=null && alertMessage!=""){
 		setAlertsMsgSP();
	}
	else{

		getAlertsMsgSP();
	}

});


$( 'div[data-role=page]' ).live( 'pageshow',function(event){

if(alertMessage!=null && alertMessage!=""){
 		setAlertsMsgSP();
	}
	else{

		getAlertsMsgSP();
	}

});



/******************************
 *	
 *	Report Outage Page
 *
 ******************************/

var numberType;
var selectedValue;
var reportedAddress;

$( '#report-outage-page' ).live( 'pageshow',function(event){
	//setAlertsMsgSP();

	var $currentPage = $(event.target);
	var $form = $currentPage.find("form#report-outage-form");
	if(stripAlpha($form.find("input[name=phone_number]").val()).length > 0){
	$form.find("input[name=account_number]").attr("disabled", "disabled");
	}
	else{
	$form.find("input[name=account_number]").removeAttr("disabled");
	}
	if(checkNull($form.find("input[name=account_number]").val()).length > 0){
	$form.find("input[name=phone_number]").attr("disabled", "disabled");
	}
	else{
	$form.find("input[name=phone_number]").removeAttr("disabled");
	}

});


/******************************
 *	
 *	Captcha Popups
 *
 ******************************/

$( 'div[data-role=page]' ).live( 'pageinit',function(event){
		
		
	var $currentPage = $(event.target);
	//alert(window.devicePixelRatio);
		
	$currentPage.find(".submit-slider-container").each(function(index){
		// This needs to go up to parent form
		var $form = $(this).closest("form");
		
		initSliderCaptcha($(this), $form);
		disableSliderTrack($(this).find(".ui-slider"));
		
	});	
	
});

$( 'div[data-role=page]' ).live( 'pagebeforeshow',function(event){
		
	var $currentPage = $(event.target);
		
	$currentPage.find(".submit-slider-container").each(function(index){
		// This needs to go up to parent form
		var $form = $(this).closest("form");
		
		resetSlideCaptcha($form);
		
	});	
	
});


/**
 *	Initializes the slider captcha and prepares the form to use it
 */
function initSliderCaptcha($container, $form){

	
	var $slider = $container.find("input[name=submit-slider]");
		
		
	var stepOne = 25;
	var stepTwo = 50;
	var stepThree = 75;
	var stepPadding = 5;
	var submitThreshold = 90;
	
	
	$slider.change(function(){
	
		var val = $slider.val();
		
		
		// Fade out label
		var opacity =  0;
		
		if(val == 0){
			opacity = 1;
		}
		else{
			opacity = val * 1.25;
			
			if(opacity > 0)
				opacity = 1 / opacity;
		}
		
		$container.find("label[for=slider-fill]").css("opacity", opacity);
		
		if(val <= (stepOne + stepPadding) && val >= (stepOne - stepPadding)){
			$form.find("input[data-step=1]").val("steponeclear");
		}
		else if(val <= (stepTwo + stepPadding) && val >= (stepTwo - stepPadding))
			$form.find("input[data-step=2]").val("steptwoclear");
		else if(val <= (stepThree + stepPadding) && val >= (stepThree - stepPadding))
			$form.find("input[data-step=3]").val("stepthreeclear");
		else if(val >= submitThreshold){	
			if(checkSlideCaptcha($form))
				$form.trigger("captchaPassed");
		}
		
	});
	
	$container.find(".ui-slider-handle").bind("vmouseup",function(event){
		
		if(!isCaptchaPassed($form)){
			// animate back
			var duration = $slider.val() * 10;
			
			$(this).animate({
					left: 0
				}, duration, function(){
					$slider.val(0);
					$slider.trigger("change");
			});
			
		}
	});
	
	//$form.on("captchaPassed", function() {
	//	if(!$form.valid()){
	//		resetSlideCaptcha($form);
	//	}
	//	else{
	//		$form.find('input[name=captcha_flag]:first').val('imahuman');
    //		$form.find(".slider-submit-button").button("enable");
    //	}
	//});
	
	$form.on("captchaPassed", function() {
		     $form.find('input[name=captcha_flag]:first').val('imahuman');
		     $form.find(".slider-submit-button").button("enable");
	});

	
}


/**
 *	Turns off the track click for the given slider control
 */

function disableSliderTrack($slider){
	
	$slider.bind("mousedown", function(event){
		
		return isTouchInSliderHandle($(this), event);
			
	});
	
	$slider.bind("touchstart", function(event){
		
		return isTouchInSliderHandle($(this), event.originalEvent.touches[0]);
			
	});
}

function isTouchInSliderHandle($slider, coords){

	var x = coords.pageX;
	var y = coords.pageY;
	
	var $handle = $slider.find(".ui-slider-handle");
		
	var left = $handle.offset().left;
	var right = (left + $handle.outerWidth());
	var top = $handle.offset().top;
	var bottom = (top + $handle.outerHeight());
	
	return (x >= left && x <= right && y >= top && y <= bottom);	
}


/**
 *	Checks to see if the slider has been moved enough to turn submit button on
 *
 *	@return boolean
 */
function checkSlideCaptcha($form){
	
	if(	$form.find("input[data-step=1]").val() == "steponeclear"
		&& $form.find("input[data-step=2]").val() == "steptwoclear"
		&& $form.find("input[data-step=3]").val() == "stepthreeclear"
		&& $form.find("input[name=captcha_flag]").val() == ""){
		return true;
	}
	
	return false;

}

/**
 *	Checks to see if the captcha form has already been passed
 *
 *	@return boolean
 */
function isCaptchaPassed($form){
	
	if(	$form.find("input[data-step=1]").val() == "steponeclear"
		&& $form.find("input[data-step=2]").val() == "steptwoclear"
		&& $form.find("input[data-step=3]").val() == "stepthreeclear"
		&& $form.find("input[name=captcha_flag]").val() == "imahuman"){
		return true;
	}
	
	return false;

}


/**
 *	Resets the slide captcha
 */
function resetSlideCaptcha($form){
	$form.find("input[data-step=1]").val("");
	$form.find("input[data-step=2]").val("");
	$form.find("input[data-step=3]").val("");
	
	
	$form.find('input[name=captcha_flag]:first').val('');
	$form.find(".slider-submit-button").button("disable");
	$form.find("input[name=submit-slider]").val("0").slider("refresh");
	
}





/******************************
 *	
 *	Masking
 *
 ******************************/

$( 'div[data-role="page"]' ).live( 'pageinit',function(event, ui){

$("input.telephone").each(function(index){
		
		$(this).attr("maxlength", 14);
	
		$(this).bind("keypress", function(event){
			
			$input = $(this);
			
			// The value of the input
			var val = $(this).val();
			
			
			// The actual key pressed
			var keyPressed = String.fromCharCode(event.keyCode);
			
			// Only accept numbers
 		 if(stripAlpha(keyPressed).length == 0){
				return false
			}
			
			// Add masking text
			else if(val.length == 0 && val.charAt(0) != "("){
				val = "(" + val;
			}
			else if(val.length == 4 && val.charAt(4) != ")"){
				val = val + ") ";
			}
			else if(val.length == 9 && val.charAt(9) != "-"){
				val = val + "-";
			}
			
			$(this).val(val);
			
			// Android hack to fix cursor issue
			if(navigator.userAgent.toLowerCase().indexOf("android") > -1){
				setTimeout(function(){
					
					$input.blur().focus();
				}, 10);
			}
			
		});
		
		
		// Clean input if no numbers
		$(this).bind("blur", function(event){
			if(stripAlpha($(this).val()).length == 0)
				$(this).val("");
		});
	
		
		
	});


});



 
    function loadCaptchaTo(imageHolder) {
    	return;
        $.support.cors = true;

        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/GetCaptchaQuestion',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            dataType: 'JSON',
            contentType: "application/json; charset=utf-8",
            success: function (data, textStatus, xhr) {

                //$('#result').text(data.d.Question);
                //$('#documentHolder').src ("data:image/png;base64," + data.d.Question);
                //document.getElementById("documentHolder").src = "data:image/png;base64," + data.d.Question;
                imageHolder.attr('src',"data:image/png;base64," + data.d.Question);
                $('#encCode').val(data.d.EncCode);
                imageHolder.show();
            },
            error: function (xhr, textStatus, errorThrown) {

                $('#result').html(textStatus);
            }
        });
    }


    function checkCaptcha() {
        $.support.cors = true;

        var captchaAnswer = {
            "resp": $('#answer').val(),
            "encCode": $('#encCode').val(),
            "isEncrypted": false
        };

        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/CheckCaptcha',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            data: JSON.stringify(captchaAnswer),
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data, textStatus, xhr) {

                alert(data.d);
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#result').html(textStatus);
            }
        });
    }


	/******************************
 	*	
 	*	Helpers
 	*
 	******************************/

	function stripAlpha(source) { 
		var stripped = new String(source); 
    	stripped = stripped.replace(/[^0-9]/g, ''); 

    	return stripped; 
	}
	
	function checkNull(source) { 
		if (typeof source == "undefined" || source == null) 
			return "";
		else
	    	return source; 
	}

 

  
/******************************
 *	
 *	Report Outage Submit Handler
 *
 ******************************/
var CustomerDataOutage;
var SelectedAddressOutage;
var outageAddressIndex;
var ETRMessage;
$( '#fuzzy-account-pao-page' ).live( 'pageinit',function(event){
	$("#address-list").empty();
	
	if (typeof CustomerDataOutage== "undefined" || CustomerDataOutage== null)
		return;
	if(CustomerDataOutage.Message != null)
	$("#multi-account-message").text(CustomerDataOutage.Message);
	
	if(CustomerDataOutage.PhoneNumber != null){
		$("#number-type").text("Phone #:");
		$("#number-value").text(CustomerDataOutage.PhoneNumber);
	}else{
		$("#number-type").text("Bill Account #:");
   	$("#number-value").text(CustomerDataOutage.AccountNumber);
	}
	//$("#number-type").text(numberType);
	//$("#number-value").text(selectedValue);
	
	
	$("#address-list").append('<tr><td><strong>Service Addr:</strong></td><td><strong>Current Outage Status</strong></td></tr>').trigger('create');
 	$.each(CustomerDataOutage.OutageData, function (idx) {
 		var isDisabled = "";
 		var outageStatusMsg = "";
 		if( this.OutageStatus == "ACTIVE" || this.OutageStatus == "FUZZY"){
 			isDisabled = "disabled";
 			outageStatusMsg = this.ETRDescription;
 		}
 		$("#address-list").append('<tr><td><input type="radio" name="add" data-theme="b" id="add-'+idx+'" value="' + this.Address + '" '+isDisabled +' /><label for="add-'+idx+'">' + this.Address + '</label></td><td>'+outageStatusMsg+'</td></tr>').trigger('create');
    });
    
    
	//on-click handler for radio button
	
	 $(function() {
	
	      $('input[type=radio]' ).click(function() {
	 	  	   outageAddressIndex=this.id; 
			  $('#submit_button_pane').show();
      
	      });
	});
	
	
	$('#submit-outage-form').submit(function() {
		reportOutage();
		return false;
	});
	
});


function reportOutage() {
        $.support.cors = true;
		if (CustomerDataOutage.PhoneNumber == null)
			CustomerDataOutage.PhoneNumber = "";
		if (CustomerDataOutage.AccountNumber== null)
			CustomerDataOutage.AccountNumber= "";
		//verify numberType (prasad)
		
		
		if(CustomerDataOutage.PhoneNumber != null && CustomerDataOutage.PhoneNumber != ""){
			numberType="Phone #";
			selectedValue=CustomerDataOutage.PhoneNumber;
		}else{
			numberType="Bill Account #:";
			selectedValue=CustomerDataOutage.AccountNumber;
		}


		
		
        var outageRequest = {
        	"phoneNumber": CustomerDataOutage.PhoneNumber,
        	"accountNumber":CustomerDataOutage.AccountNumber,
        	"indexKey": outageAddressIndex
        };
		$.mobile.showPageLoadingMsg();
        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/SubmitOutage',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            data: JSON.stringify(outageRequest),
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data, textStatus, xhr) {
	                if(data.d.ReturnStatus == "ERROR"){
	               		//alert(data.d.ErrorMessage);
	               		$('#fuzzy-accounts-error').text(data.d.ErrorMessage);
	               		$('#popupError').popup("open")
	                }else{
	                	//alert(data.d.ETRMessage);
	                	//$('#fuzzy-accounts-error').text(data.d.ETRMessage);
	               		//$('#popupError').popup("open");
	               		ETRMessage = data.d.ETRMessage;
						reportedAddress=data.d.Address;
	               		$.mobile.changePage( '../report-outage/success.html');
	                }
	                
	            },
	            error: function (xhr, textStatus, errorThrown) {
	                alert(textStatus);
	            },
	            complete: function (){$.mobile.hidePageLoadingMsg();
            }
        });
    }

  
$( '#report-outage-success-pao-page' ).live( 'pageinit',function(event){
		$("#number_type_ros").text(numberType);
		$("#selected_number_ros").text(selectedValue);
	    $( '#selected_address_ros' ).text(reportedAddress);
		$( '#etr-placeholder').text(ETRMessage);
});
    


$( '#confirm-address-pao-page' ).live( 'pageinit',function(event){
	if(CustomerDataOutage.PhoneNumber != null){
		$("#number_type").text("Phone #:");
		$("#selected_number").text(CustomerDataOutage.PhoneNumber);
	}else{
		$("#number_type").text("Bill Account #:");
		$("#selected_number").text(CustomerDataOutage.AccountNumber);
	}
	$( '#selected_address' ).text(CustomerDataOutage.OutageData[0].Address);
	
	
	outageAddressIndex='add-0';
	
	$('#submit-outage-form').submit(function() {
		reportOutage();
		return false;
	});


});

$( '#outage-summary-pao-page' ).live( 'pageinit',function(event){
	if(CustomerDataOutage){
		if(CustomerDataOutage.PhoneNumber != null){
			$("#number_type").text("Phone #:");
			$("#selected_number").text(CustomerDataOutage.PhoneNumber);
		}else{
			$("#number_type").text("Bill Account #:");
			$("#selected_number").text(CustomerDataOutage.AccountNumber);
		}
		$( '#selected_address' ).text(CustomerDataOutage.OutageData[0].Address);
		$( '#outage_etr' ).text(CustomerDataOutage.OutageData[0].ETRDescription);
	}else{
		$.mobile.changePage( '../index.html');
	}

});


$( '#report-outage-page' ).live( 'pageinit',function(event){


	loadCaptchaTo($('#rao-captcha'));
	$('#catptha-error').hide();
	$('#account-error').hide();

	
	$("#rao-captcha").click(function (event) {
        loadCaptchaTo($('#rao-captcha'));
    });

	var $currentPage = $(event.target);
	
	var $form = $currentPage.find("form#report-outage-form");
	
	//$form.find("input[name=account_number]").change(function(event){
	$form.find("input[name=account_number]").bind("keyup change blur", function(event){
		if(checkNull($(this).val()).length > 0){
			$form.find("input[name=phone_number]").attr("disabled", "disabled");
		}
		else{
			$form.find("input[name=phone_number]").removeAttr("disabled");
		}
	});
	
	//var validator = $currentPage.find("form#customer-identifier").validate({
	//$form.find("input[name=phone_number]").change(function(event){
	//		if($(this).val().length > 0){
	$form.find("input[name=phone_number]").bind("keyup change blur", function(event){
		if(checkNull(stripAlpha($(this).val())).length > 0){
			$form.find("input[name=account_number]").attr("disabled", "disabled");
		}
		else{
			$form.find("input[name=account_number]").removeAttr("disabled");
		}
	});
	
	
	var validator_outage = $form.validate({
		rules: {
	    	//account_number: {require_from_group: [1,".customer-identifier"]},
	    	account_number: {require_from_group: [1,".customer-identifier"], digits: true, maxlength: 10, minlength: 10},
	    	phone_number: {require_from_group: [1,".customer-identifier"], phoneUS: true}
		},
		messages: {
			account_number: {
				maxlength: "Please enter exactly 10 digits.",
				minlength: "Please enter exactly 10 digits."
			}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass("valid");
	        $(element).addClass("error");
	    },
	    success: function(element, validClass) {
	    	$(element).removeClass("error");
	    	$(element).addClass("valid");
	    	
	    },
		submitHandler: function(form){
			$('#catptha-error').hide();
			$('#account-error').hide();
			getRAOAddress();
	
		}
	});

});

 
 function getRAOAddress() {
        $.support.cors = true;

        var customerRequest = {
        	"captchaAns": $('#captcha-ans').val(),
            "captchaEncCode": $('#encCode').val(),
        	"accountNumber":$('#account_number').val(),
        	"phoneNumber":$('#phone_number').val()
        };
		$.mobile.showPageLoadingMsg();
        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/GetCustomerDataOutage',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            data: JSON.stringify(customerRequest),
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data, textStatus, xhr) {

               
                if(data.d.ReturnStatus == "ERROR"){
                	$('#address').text(data.d.ErrorMessage);
                	if(data.d.ErrorCode == "InvalidCaptcha"){
                		loadCaptchaTo($('#rao-captcha'));
                		$('#captcha-ans').val("");
                		$('#catptha-error').show();
                	} else if (data.d.ErrorCode == "ACCOUNT NOT FOUND"){
                		loadCaptchaTo($('#rao-captcha'));
                		$('#captcha-ans').val("");
                		$('#account-error').show();
                	}
                }else{
                	CustomerDataOutage = data.d;
                	if(CustomerDataOutage.OutageData.length > 1){
                		$.mobile.changePage( '../report-outage/fuzzy-account.html');
                	}else if(CustomerDataOutage.OutageData.length == 1){
                		if(CustomerDataOutage.OutageData[0].OutageStatus == "ACTIVE" || CustomerDataOutage.OutageData[0].OutageStatus == "FUZZY")
                			$.mobile.changePage( '../report-outage/outage-summary.html');
                		else
		                	$.mobile.changePage( '../report-outage/form.html');
	                }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#result').html(textStatus);
            },
            complete: function (){$.mobile.hidePageLoadingMsg();}
        });
    }
/**************************************/

//prasad alert

function getAlertsMsgSP() {
       $.support.cors = true;
	    $.mobile.showPageLoadingMsg();
        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/GetAlertMessage',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data, textStatus, xhr) {
      					alertMessage=data.d;
      					setAlertsMsgSP();
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#result').html(textStatus);
            },
            complete: function (){$.mobile.hidePageLoadingMsg();}
        });    }



function setAlertsMsgSP(){
	 if(alertMessage!=null && alertMessage!="" && alertMessage=="NO_MESSAGE"){
			$('#systemAlertIcon').hide();
	}
	else
	{
			$('#systemAlertMessage').text(alertMessage);
			$('#systemAlertIcon').show();
			
	}
	
}
