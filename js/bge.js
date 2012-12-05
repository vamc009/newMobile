
// BGE Namespace
if(BGE == null)
	var BGE = {};


// Prepares the two custom dialog options for bge.
BGE.prepareDialogs = function(){
	// Handle dialogs with right buttons.
	$("div[data-role='dialog']")
		.filter("div[data-close-btn-position='right']")
		.addClass("bge-dialog-no-button")
		.prepend("<a href=\"#\" data-rel=\"back\" data-role=\"button\" data-theme=\"c\" data-icon=\"delete\" data-iconpos=\"notext\" class=\"bge-dialog-close-button-right\" >Close</a>");
	
	// Handle dialogs with left buttons.	
	$("div[data-role='dialog']")
		.filter("div[data-close-btn-position='left']")
		.addClass("bge-dialog-no-button")
		.prepend("<a href=\"#\" data-rel=\"back\" data-role=\"button\" data-theme=\"c\" data-icon=\"delete\" data-iconpos=\"notext\" class=\"bge-dialog-close-button-left\" >Close</a>");
};



// Sets up slide menu events
BGE.setupSlideMenu = function($activePage){

	$activePage.find(".bge-menu-button").click(function(){
		var menu = $( ".bge-menu-button");
	
		if(menu.hasClass("active")){
			BGE.hideSlideMenu();
		}
		else{
		
			BGE.showSlideMenu();
			
		}
	});
	
	
	$activePage.find(".slidemenu a").click(function(){
		BGE.hideSlideMenu();
	});
	
};

BGE.showSlideMenu = function(){
	
	// Move slide menu under header
	var top = $(".ui-page-active .header").outerHeight();
    $(".ui-page-active .slidemenu").css("top", top);
       
	$(".ui-page-active .bge-menu-button").addClass("active");
	$( ".ui-page-active .slidemenu" ).slideDown("slow");
	
	
};

BGE.hideSlideMenu = function(){
	
	$(".ui-page-active .slidemenu" ).slideUp("slow", function(){
		$(".ui-page-active .bge-menu-button").removeClass("active");
	});
	
};


// Gives the dialog overlay a transparent background
BGE.fixDialogBackground = function(){
	
	$(function() {
	    $('div[data-role="dialog"]').live('pagebeforeshow', function(e, ui) {
			ui.prevPage.addClass("ui-dialog-background");
		});
	
	    $('div[data-role="dialog"]').live('pagehide', function(e, ui) {
			$(".ui-dialog-background").removeClass("ui-dialog-background");
		});
	});
	
};


/******************************
 *	
 *	All Pages
 *
 ******************************/


$( 'div[data-role="page"]' ).live( 'pageshow',function(event, ui){

	BGE.setupSlideMenu($(event.target));
	
	
	// Prevents the same page from being in the DOM twice
	$(ui.prevPage).remove();
  
});




