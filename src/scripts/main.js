(function( $ ) {
	$(function() {
		//units-suffix modifications
		$('.units-suffix').prev().addClass('units-suffix-prev');
		

		$('.question-container.yes-no [data-toggle="buttons"] label').click(function(event){
			event.preventDefault();
			if(event.which) {
				$(this).find(">:first-child").click();
			}
		});
		$('#tokenmessage h3').html("Introdueix el token");
		$('#tokenmessage').css('visibility','visible');
	});
	$(window).scroll(function() {
		var scroll = $(window).scrollTop();
		if (scroll >= 200) {
			if(!$(".logo-holder.scrolled").length){
				$(".logo-holder").addClass("scrolled");
			}
		}
		else {
			if($(".logo-holder.scrolled").length){
				$(".logo-holder").removeClass("scrolled");
			}
		}
	});
})(jQuery);
