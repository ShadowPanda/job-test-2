//= require jquery
//= require jquery_ujs

String.prototype.trim = function(){
	return this.replace(/(^\s+)|(\s+$)/g,'');
};

jQuery(document).ready(function($){
	var sorter = $('#sorter');

	sorter.data('original-href', sorter.attr('href')).on({
		'ajax:before': function(){
			var el = $(this);
	
			var current_order = el.data('order');
			if(typeof(current_order) == 'undefined' || current_order == null || current_order.trim() == '')
				current_order = 'desc';
			
			sorter.attr('href', sorter.data('original-href') + '?order=' + (current_order == 'desc' ? 'asc' : 'desc'));
			
			$('#people').slideUp('fast', function(){
				var loader = $('<div class="alert alert-info" id="people-loading"><h4>Loading ...</h4></div>').hide();
				$(this).replaceWith(loader);
				loader.fadeIn('fast');
			})
		},
		'ajax:success': function(event, data, text, jqxhr){
			sorter.data('order', data['order']);
			sorter.find('i').removeClass('icon-arrow-up icon-arrow-down').addClass(data['order'] == 'asc' ? 'icon-arrow-up' : 'icon-arrow-down');
			var people = $(data['output']).hide();
			
			$('#people-loading').fadeOut('fast', function(){
				$(this).replaceWith(people);
				people.slideDown('fast');
			});
		},
		'ajax:error': function(){
			var msg = $('<div class="alert alert-error" id="people"><h4>Cannot sort data ...</h4></div>').hide();

			$('#people-loading').fadeOut('fast', function(){
				$(this).replaceWith(msg);
				msg.slideDown('fast');
			});				
		}
	});

	$('#requester').on({
		'ajax:before': function(){
			$('<div class="alert alert-info" id="request-loading"><h4>Loading request ...</h4></div>').hide().appendTo($('#requests')).fadeIn('fast');
		},
		'ajax:success': function(event, data, text, jqxhr){
			$('#request-loading').remove();
			
			var klass = 'error';
			if(data['success'] == true)
				klass = 'success';
				
			var msg = $('<div class="alert alert-' + klass + '"><a class="close">×</a><h4>Request completed' + (data['success'] == false ? ' with error' : '') + '.</h4><br/><pre></pre></div>').hide();
			msg.find('pre').text(data['output']);
			msg.appendTo($('#requests')).fadeIn('fast');
		},
		'ajax:error': function(){
			$('#request-loading').remove();
			$('<div class="alert alert-error"><a class="close">×</a><h4>Request failed with unexpected error!</h4></div>').hide().appendTo($('#requests')).fadeIn('fast');
		}
	});
	
	$('body').on('click', 'a.close', function(){
		$(this).closest('div').fadeOut('fast', function(){
			$(this).remove();
		});
	});
});