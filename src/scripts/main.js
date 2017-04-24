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

function inputChange(question,input){
		var td = input.closest('td');
		var currentRow = td.data('custom-row');
		var currentCol = td.data('custom-col');
		console.log(currentCol);
		var totalRow = 0;
		var totalCol = 0;
		question.find('td').each(function(){
				//rows
				if($(this).data('custom-row') == currentRow){
						var numR = parseInt($(this).find('input[type=text]:not(.disabled)').val());
						if(isNaN(numR)){
								numR = 0;
						}
						totalRow += numR;
				}

				//cols
				if($(this).data('custom-col') == currentCol){
						var numC = parseInt($(this).find('input[type=text]:not(.disabled)').val());
						if(isNaN(numC)){
								numC = 0;
						}
						totalCol += numC;
				}
		});

		question.find('td[data-custom-row="'+currentRow+'"] input').val(totalRow);
		question.find('td[data-custom-col="'+currentCol+'"] input').val(totalCol);
}

function totalizeQuestion(question){
	var rows = question.find('tbody tr').first().find('td').length;
	var cols = question.find('tbody tr').length;

	var nR = 0;
	question.find('tbody tr .answertext').each(function(){
		$(this).removeClass("col-sm-6");
		$(this).removeClass("col-xs-12");
	});


	question.find('tbody tr').each(function(){
		var tr = $(this);

		var html  = '<td class="total information-item" data-custom-row="'+nR+'">';
		html += '<input size="12" value="" type="text" disabled="disabled" class="custom-total-row disabled form-control">';
		html += '</td>';
		tr.append(html);
		nR++;
	});
	var html  = '<tr class="well subquestion-list questions-list"><th class="answertext"></th>';
	for(var i = 0; i < rows; i++){
		html += '<td class="answer-cell-4 answer_cell_1 answer-item text-item" data-custom-col="'+i+'">';
		html += '<input type="text" disabled="disabled" class="disabled form-control custom-total-col" size="12" value="">';
		html += '</td>';
	}
	html += '<th class="answertext"></th></tr>';

	question.find('tbody').append(html);

	var row = 0;
	question.find('tbody tr').each(function(){
		var col = 0;
		$(this).find('td').each(function(){
			$(this).data('custom-row',row);
			$(this).data('custom-col',col);
			col++;
		});
		row++;
	});


	question.find('tbody tr input[type=text]:not(.disabled)').change(function(){
		inputChange(question,$(this));
	});

	question.find('tbody tr input[type=text]:not(.disabled)').each(function(){
		inputChange(question,$(this));
	});
}

(function( $ ) {
	$(function() {
		// var console=(function(){
		// 	return {
		// 		log: function(text){
		// 			if(!$('#console').length){
		// 				$('body').append('<div id="console" style="position: fixed; top: 0; left: 0; width: 100%; height: 10em; z-index:99999; background:#eee; overflow: scroll;"></div>');
		// 			}
		// 			$('#console').append(text+"<br>");
		// 			$('#console').scrollTop(999999999999);
		// 		}
		// 	};
		// }(window.console));

		if($('#question10819').length){
			totalizeQuestion($('#question10819'));
		}
		if($('#question10862').length){
			totalizeQuestion($('#question10862'));
		}
		if($('#question11095').length){
			totalizeQuestion($('#question11095'));
		}
	});
})(jQuery);
