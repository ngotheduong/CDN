/**
 * Javascript Download Manager 1.0
 *
 * @author: Rilwis
 * @email: rilwis@gmail.com
 * @url: http://hontap.blogspot.com
 * @licensed: MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * This script is based on Easy Retweet Button of John Resig (http://ejohn.org/blog/retweet/)
 */
(function(){
var loadCount = 1;
// Asynchronously load the Bit.ly JavaScript API
// If it hasn't been loaded already
if (typeof BitlyClient === 'undefined') {
	var head = document.getElementsByTagName('head')[0] || document.documentElement;
	var script = document.createElement('script');
	script.src = 'http://bit.ly/javascript-api.js?version=latest&login=jsdownloadmanager&apiKey=R_cb7db004d13ea77433d43f3b5c579a3f';
	head.appendChild(script);
	var check = setInterval(function(){
		if (typeof BitlyCB !== 'undefined') {
			clearInterval(check);
			head.removeChild(script);
			loaded();
		}
	}, 10);
	loadCount = 0;
}
if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', loaded, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', loaded);
}
function loaded(){
	if (++loadCount < 2) {
		return;
	}
	var elems = [], urlElem = {}, hashURL = {};
	BitlyCB.shortenResponse = function(data) {
		for (var url in data.results) {
			var hash = data.results[url].userHash;
			hashURL[hash] = url;
			var elems = urlElem[ url ];
			for ( var i = 0; i < elems.length; i++ ) {
				elems[i].href = 'http://bit.ly/' + hash;
			}
			BitlyClient.stats(hash, 'BitlyCB.statsResponse');
		}
	};
	BitlyCB.statsResponse = function(data) {
		var clicks = data.results.clicks, hash = data.results.userHash;
		var url = hashURL[hash], elems = urlElem[url];
		for (var i = 0; i < elems.length; i++) {
			var span = document.createElement('span');
			if (clicks == 1) {
				span.appendChild(document.createTextNode(' (' + clicks + ' download)'));
			} else {
				span.appendChild(document.createTextNode(' (' + clicks + ' downloads)'));
			}
			elems[i].appendChild(span);
		}
		hashURL[hash] = urlElem[url] = null;
	};
	if (document.getElementsByClassName) {
		elems = document.getElementsByClassName('jdm');
	} else {
		var tmp = document.getElementsByTagName('a');
		for (var i = 0; i < tmp.length; i++) {
			if (/(^|\s)jdm(\s|$)/.test(tmp[i].className)) {
				elems.push(tmp[i]);
			}
		}
	}
	for (var i = 0; i < elems.length; i++) {
		var elem = elems[i];
		var href = elem.href;
		if (urlElem[href]) {
			urlElem[href].push(elem);
		} else {
			urlElem[href] = [elem];
			BitlyClient.shorten(href, 'BitlyCB.shortenResponse');
		}
	}
}
})();