
// Make sure BGE namespace exists
if(BGE == null)
	var BGE = {};

BGE.Form = {};

/******************************Prasad index
 *	
 *	Contact Us Identifier Page
 *
 ******************************/


$( '#contact-us-page' ).live( 'pageshow',function(event){
	
	//ExecuteOrDelayUntilScriptLoaded(function () {
  	//GetAlertsMsg()}, "sp.js");
  
	//GetAlertsMsg();
	
	var $currentPage = $(event.target);
	var $form = $currentPage.find("form#customer-identifier");
	if(checkNull(stripAlpha($form.find("input[name=phone_number]").val())).length > 0){
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
	
	  $('#general_entry').click(function() {
			 recognized=false;		
			  $.mobile.changePage( '../contact/form.html');
	      });


});


$( '#contact-us-page' ).live( 'pageinit',function(event){
	 
	
	loadCaptchaTo($('#rao-captcha'));
	$('#catptha-error').hide();
	
	$("#rao-captcha").click(function (event) {
       loadCaptchaTo($('#rao-captcha'));
   });

	var $currentPage = $(event.target);
	
	var $form = $currentPage.find("form#customer-identifier");
	
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
	
	
	var validator = $form.validate({
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
			//if($(form).find("input[name=captcha_flag]:first").val() == "imahuman"){
			//	resetSlideCaptcha($(form));
			//	form.submit();
			//}
			$('#catptha-error').hide();
			getAddress();
			return false;
			
			//$('#customer-identifier').submit(function() {
			//	$('#catptha-error').hide();
			//	getAddress();
			//	return false;
			//});
			
		}
	});
	
	
	
	
});



/******************************prasad form
 *	
 *	Contact Us Form
 *
 ******************************/

var enteredAccountNumber; //user Entered Account Number
var enteredPhoneNumber; //user entered phone number
var selectedAddress; // user selected account from fuzzy list
var selectedAddressIndex;//to retrieve the encrypted Address
var recordsFound=0; // addresses found with the account/phone entered by customer
var recognized; // recognized customer or un-recognized
var ConCustomerData; // encrypted addresses from the webservice
var ConCustomerAddresses; // striped address from the webservice

//declare form and it's attributes
var formAttributes;

$( '#contact-form-page' ).live( 'pageinit',function(event){

	var $currentPage = $(event.target);
	
	//var testAboutYouData = {"firstName" : "John",
	//	"lastName" : "Doe",
	//	"accountNumber" : "1234567890",
	//	"email" : "jdoe@gmail.com",
	//	"phone" : "333-555-6666"	
	//};
	var AboutSelectedAccountData = {
		"con_entered_account" : enteredAccountNumber,
		"con_entered_phone" : enteredPhoneNumber,
		//"email" : "avvaru.avvaru@constellation.com",
		"con_selected_address": selectedAddress
	};
	
	
	
	BGE.Form.setupAboutYou($currentPage.find("#contact-form:first"), AboutSelectedAccountData);
	
	//$('#con-selected-account').val("goodmorning");
	
	var testLocationData = {"streetAddress" : "123 Main St.",
		"city" : "Baltimore",
		"zip" : "12345",
	};
	
	BGE.Form.setupLocationOfProblem($currentPage.find("#contact-form:first"), testLocationData);
	
	BGE.Form.setupContactForm($currentPage.find("#contact-form:first"));
	
	
//	var $currentPage = $(event.target);
//	var $form = $currentPage.find("form#contact-form");
//	var validator = $form.validate({
//		submitHandler: function(form){
//			submitContactUsForm();
//		}
//	});


   $('#form_manualentry').click(function() {
			 recognized=false;
			 
			 var $currentPage = $(event.target);
			 var $form = $currentPage.find("form#contact-form"); 		
		 	 $form.find(".form-section-about-you-unrecognized").show();
		  	 $form.find(".form-section-about-you-recognized").hide();
		  	 $form.find(".unrecognized_message").hide();

		
	      });

	
	
});



$( '#contact-form-page' ).live( 'pageremove', function(event){
	var $currentPage = $(event.target);
	$currentPage.find("#contact-form:first").find("select[name=purposeofcommunication]").die("change");
	
});




/******************************
 *	
 *	Form Component Setup
 *
 ******************************/
 
BGE.Form.setupLocationOfProblem = function($form, data){
		$form.find("input[name=location_problem]").live("change", function(){
				if($(this).val() == "location-is-service-address"){
					$form.find("input[name='street_address']").val(data.streetAddress);
		    		$form.find("input[name='city']").val(data.city);
		    		$form.find("input[name='state']").val("Maryland");
		    		$form.find("input[name='zip']").val(data.zip);
		    		$form.find(".enter-location-details").hide();
					}
					else{
								$form.find("input[name='street_address']").val("");
					    		$form.find("input[name='city']").val("");
					    		$form.find("input[name='state']").val("Maryland");
					    		$form.find("input[name='zip']").val("");
					    		$form.find(".enter-location-details").show();
					    		
		    		
					}
			 });			
	
}

//prasad recognized
BGE.Form.setupAboutYou = function($form, data){
	
	
	//$form.find("input[name='first_name']").val(data.firstName);
    //$form.find("input[name='last_name']").val(data.lastName);
    //$form.find("input[name='account_number']").val(data.accountNumber);
    //$form.find("input[name='email']").val(data.email);
    //$form.find("input[name='phone']").val(data.phone);
  
   if(recognized==true){
   
		$('#con_entered_account').text(data.con_entered_account);
		$('#con_entered_phone').text(data.con_entered_phone);
		$('#con_selected_address').text(data.con_selected_address);
		$('#email').val(data.email);
		
		if(data.con_entered_phone==null || data.con_entered_phone=="")
		{
			$form.find(".your-phone-info").hide();
		}
		if(data.con_entered_account==null || data.con_entered_account=="")
		{
			$form.find(".your-account-info").hide();
		}

		
		
		$form.find(".form-section-about-you-unrecognized").hide();
	}else{
		$form.find(".form-section-about-you-recognized").hide();
	}
	
	
	

}


BGE.Form.setupLightDetails = function($form){
	
	
	// Toggle the phone number for the request special access button
	$form.find("input[name=requires-special-access]").live("change", function(){
    		
    	if($(this).is(":checked")){
			$form.find(".phone-number-for-access-container").show();
		}
		else{
			$form.find(".phone-number-for-access-container").hide();
			$form.find(".phone-number-for-access").val("");
		}
	});
	
	
	
	
}
//prasad validations
BGE.Form.setupContactForm = function($form){
	
	var validator = $form.validate({
		rules: {
			first_name: {required: true},
			last_name: {required: true},
	    	email: {email: true, required: true},
	    	email_ureg: {required: true},
	    	street_address: {required: true},
	    	city: {required: true},
	    	zip: {required: true, digits: true, maxlength: 5, minlength: 5},
	    	location_problem: {required: true},
	    	phone_number_for_access: {required: true, phoneUS: true},
	    	account_number: {digits: true, maxlength: 10, minlength: 10},
	    	comments:{required:true},
	    	phone:{required:true,phoneUS: true}
		},
		highlight: function(element, errorClass) {
			$(element).removeClass("valid");
	        $(element).addClass("error");
	    },
	    success: function(element, validClass) {
	    	$(element).removeClass("error");
	    	$(element).addClass("valid");
	    },
	    messages: {
		    zip: {maxlength: "Please enter exactly 5 digits.", minlength: "Please enter exactly 5 digits."},
		    account_number: {
				maxlength: "Please enter exactly 10 digits.",
				minlength: "Please enter exactly 10 digits."
			}
	    },
	    submitHandler: function(form){
	    
	    //prasad submit
	    var emailInput;
	    var CustomerAddressEncrypt;
	    var $pocDrop = $form.find("select[name=purpose_of_communication]");
		var FormTypeID=$pocDrop.val();
		var FormName=$pocDrop.find(":selected").text();	
		var formData = new Array();			
		var count=0;
		if($pocDrop.val() == "CULO"){
			 $('.altAddress').each(function() {
			 	if(this.id && this.value!=null && this.value!="" && this.type!='radio'){
			   				   formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
  			    }
  			    else if(this.id && this.value!=null && this.value!="" && this.type=='radio'){
	  			    if(this.checked)
	  			    {
		  			    formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
	  			    }
  			    }
  			    
		 	});
		 	
		 	 $('select.lightoutage,input.lightoutage').each(function() {
			 	 if(this.id && this.value!=null && this.value!="" && this.type!='radio'){
			   				   formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
  			    }
  			    else if(this.id && this.value!=null && this.value!="" && this.type=='radio'){
	  			    if(this.checked)
	  			    {
		  			    formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
	  			    }
  			    }
		 	});
		 	
	 	
		}
		else if($pocDrop.val() == "CUVT"){
			 $('.altAddress').each(function() {
				 if(this.id && this.value!=null && this.value!="" && this.type!='radio'){
			   				   formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
  			    }
  			    else if(this.id && this.value!=null && this.value!="" && this.type=='radio'){
	  			    if(this.checked)
	  			    {
		  			    formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
	  			    }
  			    }
			 });
		}
				
				//default comments
				if($('#comments').val()!=null && $('#comments').val()!="")
				{
					formData[count]={"FieldName":"comments","Fieldvalue":$('#comments').val()};
					count++;
				}
				
				//un-recognized
				if(recognized==false)
				{
					 $('.unreginfo').each(function() {
					 	if(this.id && this.value!=null && this.value!="" && this.type!='radio'){
			   				   formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
  			   		 }
  			   			 else if(this.id && this.value!=null && this.value!="" && this.type=='radio'){
			  			    if(this.checked)
			  			    {
				  			    formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
						   			   count++;
			  			    }
  			    		}
				 	});
				 	
			 		emailInput=$('#email_ureg').val();
			 		
			 	
			 	}
			 	
			 		//recognized
				if(recognized==true)
				{
					 $('.reginfo').each(function() {
						if(this.id && this.value!=null && this.value!="" && this.type!='radio'){
			   				   formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
				   			   count++;
		  			    }
		  			    else if(this.id && this.value!=null && this.value!="" && this.type=='radio'){
				  			    if(this.checked)
				  			    {
					  			    formData[count]={"FieldName":this.id,"Fieldvalue":this.value};
						   			   count++;
				  			    }
  					    }				 	
  					  });
				 	emailInput=$('#email').val();
				 	
				 	if(selectedAddressIndex!=null && selectedAddressIndex!="")
				 	{
				 		CustomerAddressEncrypt=ConCustomerData[selectedAddressIndex.substring(selectedAddressIndex.indexOf("-")+1,selectedAddressIndex.length)];
				 	}
				 	else{
					 	CustomerAddressEncrypt=ConCustomerData[0];
				 	}
			 	
			 	}

		if(CustomerAddressEncrypt!=null && CustomerAddressEncrypt!=""){
			var formMetadata = { 	
	        	"FormTypeId":FormTypeID ,
	        	"FormName": FormName,
	        	"emailAddress":emailInput,
	        	"FormData":formData,
	        	"CustomerAddressData":CustomerAddressEncrypt
	        };
		}
		else{
				var formMetadata = { 	
			        	"FormTypeId":FormTypeID ,
			        	"FormName": FormName,
			        	"emailAddress":emailInput,
			        	"FormData":formData
        			};


			}	 	
					
		
        
        //send the data to webservice
        var formData={
          "frmData":formMetadata
        };
				
		
				//submitContactUsForm(formMetadata);
				submitContactUsForm(formData);
			
		}

	});
	

	// Setup show/hide logic for the contact form.
	
	var $pocDrop = $form.find("select[name=purpose_of_communication]");
	
	if(checkNull($pocDrop.val()).length > 0){
		$form.find(".form-section-comments").show();
		$form.find("div.ui-submit").show();
	}
	else{
		$form.find(".form-section-comments").hide();
		$form.find("textarea[name=comments]").val("");
		$form.find("div.ui-submit").hide();
	}
	
	
	$pocDrop.live("change", function(){
	
		if(checkNull($pocDrop.val()).length > 0){
			$form.find(".form-section-comments").show();
			$form.find("div.ui-submit").show();
		}
		else{
			$form.find(".form-section-comments").hide();
			$form.find("textarea[name=comments]").val("");
			$form.find("div.ui-submit").hide();
		}
		
		// Clear validation messages
		validator.resetForm();

		// Reset the form
		BGE.Form.resetContactForm($form);

		if($pocDrop.val() == "CULO"){
			$form.find(".form-section-light-details").show();
			$form.find(".form-section-location-of-problem").show();
			
			if(recognized==false)
			{
				$form.find(".locationproblem").hide();
				$form.find("input[name='street_address']").val("");
		   		$form.find("input[name='city']").val("");
		   		$form.find("input[name='state']").val("Maryland");
		   		$form.find("input[name='zip']").val("");
		   		$form.find(".enter-location-details").show();
			}
			
		}
		else if($pocDrop.val() == "CUVT"){
			$form.find(".form-section-location-of-problem").show();
			if(recognized==false)
			{
				$form.find(".locationproblem").hide();
				$form.find("input[name='street_address']").val("");
		   		$form.find("input[name='city']").val("");
		   		$form.find("input[name='state']").val("Maryland");
		   		$form.find("input[name='zip']").val("");
		   		$form.find(".enter-location-details").show();
			}
		}
		else if($pocDrop.val() == "non-hazardous concerns"){
			$form.find(".form-section-location-of-problem").show();
		}
	
	});
	
	var $tolCheck = $form.find("input[name=type_of_light]");
	
	$tolCheck.live("change", function(){
		var tolCheckVal = $form.find("input[name=type_of_light]:checked").val().toLowerCase();
		
		
		if(tolCheckVal == "other"){
			
			$form.find("input[name=other_description]").show();
		}
		else{
			
			$form.find("input[name=other_description]").hide();
		}
		
	});
	
	
	var $rsaCheck = $form.find("input[name=requires_special_access]");
	
	$rsaCheck.live("change", function(){
		if($rsaCheck.is(":checked")){
			$form.find(".phone-number-for-access-container").show();
		}
		else{
			$form.find(".phone-number-for-access-container").hide();
			$form.find(".phone-number-for-access").val("");
		}
	});
	
};



BGE.Form.resetContactForm = function($form){

	var $pocDrop = $form.find("select[name=purpose_of_communication]");

	// Wipe all form data.
	//$form.find("input[type=text]").each(function(index){
	//	$(this).val("");
		$form.find("input[type=text], input[type=email], input[type=tel]").each(function(index){
		if(checkNull($(this).closest(".form-section-about-you")).length == 0){
			$(this).val("");
		}
	});

//	$form.find("input[type=checkbox]").each(function(index){
//		$(this).attr('checked', false).checkboxradio("refresh");
//	});
	
//	$form.find("input[type=radio]").each(function(index){
//		$(this).attr('checked', false).checkboxradio("refresh");
	$form.find("input[type=checkbox], input[type=radio]").each(function(index){
		if(checkNull($(this).closest(".form-section-about-you")).length == 0){
			$(this).attr('checked', false).checkboxradio("refresh");
		}
	});
	
	$form.find("select").each(function(index){
	//	if($(this).attr("name") != $pocDrop.attr("name")){
	//		$(this).selectmenu();
	//		$(this).val("").selectmenu('refresh');
		if(checkNull($(this).closest(".form-section-about-you")).length == 0){
			if($(this).attr("name") != $pocDrop.attr("name")){
				$(this).selectmenu();
				$(this).val("").selectmenu('refresh');
			}
 		
	
		}

	});
	
	
	// Set the state
	$form.find("input[name=state]").val("Maryland");
	
	// Set the radio buttons
	$form.find("input[name=location_problem]:first").attr("checked", true).checkboxradio("refresh");
	$form.find("input[name=type_of_light]:first").attr("checked", true).checkboxradio("refresh");
	
	
	// Hide all form sections
	$form.find(".form-section-light-details").hide();
	$form.find(".form-section-location-of-problem").hide();
	$form.find(".enter-location-details").hide();
	$form.find(".phone-number-for-access-container").hide();
	$form.find("input[name=other_description]").hide();


};


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





/******************************prasad fuzzy
 *	
 *	Contact US forms Submit Handler
 *
 ******************************/
 
$( '#fuzzy-account-con-page' ).live( 'pageshow',function(event){
	//setAlertsMsgSP();
}); 
$( '#fuzzy-account-con-page' ).live( 'pageinit',function(event){


	
	//GetAlertsMsg();
	//display the count
	$("#address-list").empty();

	//$("#address-list").append('<tr><td><strong>Service Address:</strong></td><td><strong>Est. Time of Restoral</strong></td></tr>').trigger('create');
	$("#address-list").append('<tr><td><strong>Service Address:</strong></td></tr>').trigger('create');
	recordsFound=0;
 	$.each(ConCustomerAddresses, function (idx) {
 		$("#address-list").append('<tr><td><input type="radio" name="add" data-theme="b" id="add-'+idx+'" value="' + ConCustomerAddresses[recordsFound]+ '"  /><label for="add-'+idx+'">' + ConCustomerAddresses[recordsFound]+ '</label></td></tr>').trigger('create');
 		recordsFound++;
    });
	
	//$("#address-list").append('<tr><td><input type="radio" name="add" data-theme="b" id="add-'+recordsFound+'" value="Other"  /><label for="add-'+recordsFound+'">Other</label></td></tr>').trigger('create');
	
	$('#recordsFound').text("Our systems indicate that you have "+recordsFound+" addresses listed under the account you have provided.  Please select an address below.");
	
	if(enteredPhoneNumber!=null){
		$('#con_fuzzy_entered_phone').text("Phone #:  "+enteredPhoneNumber);
	}
	
	
	//avvaru

	$(function() {
	
	      $('input[type=radio]' ).click(function() {
	 	  	   selectedAddress =this.value;
	 	  	   selectedAddressIndex=this.id; 
					//redirect to form page
			 if(selectedAddress=='Other')
			 recognized=false;		
			  $.mobile.changePage( '../contact/form.html');

	 	      
	      });
	      
	      
	      //fuzzy to manual entry
	      
	      $('#fuzzy_manualentry').click(function() {
			 recognized=false;		
			  $.mobile.changePage( '../contact/form.html');

	 	      
	      });

	      
	      
	});
	
	
	
	
	

	
});

 
 function getAddress() {
        $.support.cors = true;

        var customerRequest = {
        	"captchaAns": $('#captcha-ans').val(),
            "captchaEncCode": $('#encCode').val(),
        	"accountNumber":$('#account_number').val(),
        	"phoneNumber":$('#phone_number').val()
        	//"phoneNumber":9999999999
        };
		$.mobile.showPageLoadingMsg();
        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/GetCustomerDetails',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            data: JSON.stringify(customerRequest),
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data, textStatus, xhr) {
            

			ConCustomerData = data.d.CustomerAddressData;
			ConCustomerAddresses = data.d.DisplayAddress;
			
			
			
                if(data.d.ReturnStatus == "ERROR"){
                	$('#address').text(data.d.ErrorMessage);
                	if(data.d.ErrorCode == "InvalidCaptcha"){
                		loadCaptchaTo($('#rao-captcha'));
                		$('#captcha-ans').val("");
                		$('#catptha-error').show();
                	}
                	else if(data.d.ErrorCode=="ACCOUNT NOT FOUND"){
                	    enteredAccountNumber =$('#account_number').val();
                	    enteredPhoneNumber =$('#phone_number').val();
                	    recognized=false;
                		$.mobile.changePage( '../contact/form.html');
                	}
                }else{
                	recognized=true;
                	if(checkNull(data.d.CustomerAddressData).length > 1){
                    	 enteredPhoneNumber=$('#phone_number').val();
                    	 enteredAccountNumber =$('#account_number').val();
                		$.mobile.changePage( '../contact/fuzzy-account-con.html');
                		
                	}else{
                	    // only one records found (start)

                		 $.each(ConCustomerAddresses, function (idx) {
 	                          enteredAccountNumber =$('#account_number').val();
 	                          enteredPhoneNumber=$('#phone_number').val();
 	                          selectedAddress =ConCustomerAddresses[0]; 
						    });
                		$.mobile.changePage( '../contact/form.html');
                		// only one records found (end)
	                }
                	
                	//ConCustomerData = data.d.CustomerAddressData;
                	
                	
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#result').html(textStatus);
            },
            complete: function (){$.mobile.hidePageLoadingMsg();}
        });
    }


    function loadCaptchaTo(imageHolder) {
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
 


/***************************** prasad success
*
* contactu us Sucess form
*****************************/
$( '#con-success-page' ).live( 'pageshow',function(event){
	//setAlertsMsgSP();
});

$( '#con-success-page' ).live( 'pageinit',function(event){
	//GetAlertsMsg();
	//setAlertsMsgSP();
	//var $currentPage = $(event.target);
	
	if(referenceNumber!=null && referenceNumber!=""){
		$('#con-error-message').hide();
		$('#con_confirmation_number').text(referenceNumber);
	}
	else{
		$('#con-sucess-message').hide();
		$('#con-error-message').hide();
	
	}
});


var referenceNumber;
function submitContactUsForm(formMetadata) {
 		$.support.cors = true;
 		
 		var $currentPage = $(event.target);
	    var $form = $currentPage.find("form#contact-form");
	    $.mobile.showPageLoadingMsg();
        $.ajax({
            url: 'https://stg-secure.bge.com/_layouts/Bge.Mobile.Services/AnonymousService.asmx/SubmitContactUsForm',
            type: 'POST',
            headers : { "cache-control": "no-cache" },
            data: JSON.stringify(formMetadata),
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            success: function (data, textStatus, xhr) {
                		//referenceNumber=data.d.reqOutput;
                		referenceNumber=data.d;
                		//alert("reference number"+referenceNumber);
                		$.mobile.changePage( '../contact/success.html');
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#result').html(textStatus);
            },
            complete: function (){$.mobile.hidePageLoadingMsg();}
        });
    }

