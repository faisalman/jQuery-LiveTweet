/* 
JQUERY LIVETWEET 0.2
by Sergio Martino
http://www.dailygrind.it
https://github.com/sergiomartino/jQuery-LiveTweet
*/

(function($){
	var settings = {      
		'limit' : 5,		
		'username' : 'jeresig',
		'timeout' : 2000,		
		'html_before' : '<ul>',
		'html_tweets' : '<li>{text}<br>{date}</li>',
		'html_after' : '</ul>',
		'loading_text' : 'loading...',
		'format_date' : function(d) {
			return $.fn.livetweet('format_date', d)		
		},
		'error_text' : 'an error has occurred!'
	};

	var methods = {
		init : function(options) {
			var $this = this;			
			if(options) $.extend(settings, options);
				
			
			$.ajax({
				beforeSend : $this.html('<span class="livetweet-loading">'+settings.loading_text+'</span>'),
				url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+settings.username,
				type: 'GET',
				dataType: 'jsonp',						
				timeout: settings.timeout,
				error: function() {
					$this.html('<span class="livetweet-error">'+settings.error+'</span>');
				},
				success: function(json){																		
					$this.find(".livetweet-loading").remove();
					sizer = json.length > settings.limit ? settings.limit : json.length;
					rt = settings.html_before;
					tweets = '';
					for(i=0;i<sizer;i++) {							
						text = settings.html_tweets.replace('{text}', $.fn.livetweet('format_links', json[i].text));																								
						tweets += text.replace('{date}', settings.format_date(new Date(Date.parse(new Date(Date.parse(json[i].created_at.replace(/(\+\S+) (.*)/, '$2 $1')))))));
					}
					rt += tweets+settings.html_after;					
					return $this.each(function() {
						$(this).append(rt);
					});	
				}
			});							
		
		},
		format_links : function(t) {			
			var rxp_url = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
            var rxp_user = /[\@]+([A-Za-z0-9-_]+)/gi;
            var rxp_hash = / [\#]+([A-Za-z0-9-_]+)/gi;

			t = t.replace(rxp_url,'<a target="_blank" href="$1">$1</a>');
			t = t.replace(rxp_user,'<a target="_blank" href="http://twitter.com/$1">@$1</a>');
			t = t.replace(rxp_hash,'<a target="_blank" href=""http://search.twitter.com/search?q=&tag=$1&lang=all">#$1</a>');
			
			return t;
		},
		format_date : function(dt) {			
			var m = new Array('GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC');
			var d = new Array('Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato');		
			return d[dt.getDay()]+ " " + dt.getDate() + " " + m[dt.getMonth()] + " " + dt.getFullYear();		
		}
	};

	$.fn.livetweet = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on jQuery.livetweet');
		}    
	};
})(jQuery);