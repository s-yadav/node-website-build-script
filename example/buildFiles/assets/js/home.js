// JavaScript Document
$(function(){
	//activate scroll spy
	$('body').scrollspy({ target: '#contentNav' ,offset:100 } );
	
	//make contentNav to fixed on scroll
	
	$(window).scroll(function(e) {
        var scrollTop=$(this).scrollTop();
		if(scrollTop > 150){
				jqOb('#contentNav').addClass('fixed');
			}
		else{
				jqOb('#contentNav').removeClass('fixed');
			}	
    });
	
	//to properly position divs on anchor click
	
	$(window).on('hashchange', function(e) {
	   setTimeout(function(){
	   	$(this).scrollTop($(this).scrollTop() - 90);
	   },0);
	});

});;