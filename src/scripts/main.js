(function( $ ) {
  $(function() {
	  $('.question-container.yes-no [data-toggle="buttons"] label').click(function(event){
  		event.preventDefault();
  		if(event.which) {
  			$(this).find(">:first-child").click();
  		}
  	});
  });
})(jQuery);
