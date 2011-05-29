/* 
JQUERY LIVETWEET 0.4
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
		'use_relative_dates' : true,
		'format_date' : function(d) {			
			return (this.use_relative_dates) ? $.fn.livetweet('relative_date',d) : $.fn.livetweet('format_date', d);		
		},
		'error_text' : 'an error has occurred!'
	};
	
	var m = new Array('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC');
	var d = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	var rds = new Array('seconds ago', 'about 1 minute ago', 'minutes ago', 'about 1 hour ago', 'hours ago', 'about 1 day ago', 'days ago', 'long time ago');	
	
	var methods = {
		init : function(options) {
			var $this = this;			
			if(options) $.extend(settings, options);
							
			$.ajax({
				beforeSend : function() {$this.html('<span class="livetweet-loading">'+settings.loading_text+'</span>');},					
				url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+settings.username+'&count='+settings.limit,
				type: 'GET',
				dataType: 'jsonp',						
				timeout: settings.timeout,
				error: function() {
					$this.html('<span class="livetweet-error">'+settings.error_text+'</span>');
				},
				success: function(json){																		
					$this.find(".livetweet-loading").remove();
					sizer = json.length > settings.limit ? settings.limit : json.length;
					rt = settings.html_before;
					tweets = '';
					for(i=0;i<sizer;i++) {							
						text = settings.html_tweets.replace('{text}', $.fn.livetweet('format_links', json[i].text));																								
						tweets += text.replace('{date}', settings.format_date(new Date(Date.parse(json[i].created_at.replace(/(\+\S+) (.*)/, '$2 $1')))));
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
            var rxp_hash = /[\#]+([A-Za-z0-9-_]+)/gi;

			t = t.replace(rxp_url,'<a target="_blank" href="$1">$1</a>');
			t = t.replace(rxp_user,'<a target="_blank" href="http://twitter.com/$1">@$1</a>');
			t = t.replace(rxp_hash,'<a target="_blank" href="http://search.twitter.com/search?q=&tag=$1&lang=all">#$1</a>');
			
			return t;
		},
		format_date : function(dt) {			
			return d[dt.getDay()]+ " " + dt.getDate() + " " + m[dt.getMonth()] + " " + dt.getFullYear();		
		},
		relative_date : function(dt) {
			time_span = ((new Date()).getTime() - dt.getTime())/1000;				
			if(time_span < 60) return time_span + " " + rds[0];
			if(time_span >= 60 && time_span < 120) return rds[1];
			if(time_span >= 120 && time_span < 3600) return Math.floor(time_span/60) + " " + rds[2];
			if(time_span >= 3600 && time_span < 7200) return rds[3];
			if(time_span >= 7200 && time_span < 86400) return Math.floor(time_span/60/60) + " " + rds[4];
			if(time_span >= 86400 && time_span < 172800) return rds[5];
			if(time_span >= 172800 && time_span < 2592000) return Math.floor(time_span/60/60/24) + " " + rds[6];
			if(time_span >= 2592000) return rds[7];
			return "Ice age";
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
