/* 
JQUERY LIVETWEET 0.5
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
		'lang' : 'en',
		'use_relative_dates' : true,
		'format_date' : function(d) {			
			return (this.use_relative_dates) ? $.fn.livetweet('relative_date',d) : $.fn.livetweet('format_date', d);
		}		
	};
	
	var loc = {
		'en' : {
			'months' : 'JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC',
			'days' : 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
			'time_span' : 'seconds ago,about 1 minute ago,minutes ago,about 1 hour ago,hours ago,about 1 day ago,days ago,long time ago',
			'error' : 'An error has occured!',
			'loading' : 'Loading...'
		},
		'id' : {
			'months' : 'JAN,FEB,MAR,APR,MEI,JUN,JUL,AUG,SEP,OKT,NOV,DES',
			'days' : 'Minggu,Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
			'time_span' : 'detik lalu,sekitar 1 menit lalu,menit lalu,sekitar 1 jam lalu,jam lalu,sekitar 1 hari lalu,hari lalu,sejak lama',
			'error' : 'Kesalahan telah terjadi!',
			'loading' : 'Memuat...'
		},
		'it' : {
			'months' : 'GEN,FEB,MAR,APR,MAG,GIU,LUG,AGO,SET,OTT,NOV,DIC',
			'days' : 'Domenica,Lunedì,Martedì,Mercoledì,Giovedì,Venerdì,Sabato',
			'time_span' : 'secondi fa,circa 1 minuto fa,minuti fa,circa 1 ora fa,ore fa,circa 1 giorno fa,giorni fa,tempo fa',
			'error' : 'Si è verificato un errore!',
			'loading' : 'Caricamento...'
		}	
	};
	
	var _months, _days, _timespan;
	
	var methods = {
		init : function(options) {
			var $this = this;			
			if(options) $.extend(settings, options);														
			
			_months = loc[settings.lang]['months'].split(',');
			_days = loc[settings.lang]['days'].split(',');
			_timespan = loc[settings.lang]['time_span'].split(',');				
			
			$.ajax({
				beforeSend : function() {$this.html('<span class="livetweet-loading">'+loc[settings.lang]['loading']+'</span>');},
				url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+settings.username+'&count='+settings.limit,
				type: 'GET',
				dataType: 'jsonp',						
				timeout: settings.timeout,
				error: function() {
					$this.html('<span class="livetweet-error">'+loc[settings.lang]['error']+'</span>');
				},
				success: function(json){																		
					$this.find(".livetweet-loading").remove();
					rt = settings.html_before;
					tweets = '';
					for(i=0;i<json.length;i++) {							
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
			return _days[dt.getDay()]+ ' ' + dt.getDate() + ' ' + _months[dt.getMonth()] + ' ' + dt.getFullYear();		
		},
		
		relative_date : function(dt) {
			diff = ((new Date()).getTime() - dt.getTime())/1000;				
			if(diff < 60) return Math.round(diff) + ' ' + _timespan[0];
			if(diff >= 60 && diff < 120) return _timespan[1];
			if(diff >= 120 && diff < 3600) return Math.floor(diff/60) + ' ' + _timespan[2];
			if(diff >= 3600 && diff < 7200) return _timespan[3];
			if(diff >= 7200 && diff < 86400) return Math.floor(diff/60/60) + ' ' + _timespan[4];
			if(diff >= 86400 && diff < 172800) return _timespan[5];
			if(diff >= 172800 && diff < 2592000) return Math.floor(diff/60/60/24) + ' ' + _timespan[6];
			if(diff >= 2592000) return _timespan[7];
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
