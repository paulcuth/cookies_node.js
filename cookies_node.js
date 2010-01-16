
var http = require ('http');





/* Cookie
------------------ */


var Cookie = function (key, value, options) {
	if (!key) throw new Error ('Cookie requires a key');

	options = options || {};
	
	this.key = key;
	this.value = value;
	this.expires = options.expires;
	this.path = options.path;
	this.domain = options.domain;
	this.http_only = options.http_only;
}


Cookie.prototype.to_cookie_string = function () {
	var str;
	
	if (str = this.key) {
		str += '=' + this.value;
		
		if (this.expires && this.expires instanceof Date) str += '; expires=' + this.expires.toUTCString ();
		if (this.path) str += '; path=' + encodeURIComponent (this.path);
		if (this.domain) str += '; domain=' + this.domain;
		if (this.http_only) str += '; HttpOnly';
	}

	return str;
}


Cookie.prototype.valueOf = function () {
	return this.value;
}


Cookie.prototype.toString = function () {
	return this.value;
}





/* CookieHandler
------------------ */


var CookieHandler = function () {
	this._cookies = {};
}


CookieHandler.prototype.get_cookie = function (key) {
	return this._cookies[key];
};


CookieHandler.prototype.set_cookie = function (key, value, options) {
	this._cookies[key] = new Cookie (key, value, options);
};


CookieHandler.prototype.add_cookie = function (cookie) {
	if (!(cookie instanceof Cookie)) throw new Error ('CookieHandler.add_cookie() requires an object of type Cookie');	
	this._cookies[cookie.key] = cookie;
};


CookieHandler.prototype.get_all_cookies = function () {
	return this._cookies;
};





/* exports
------------------ */


exports.Cookie = Cookie;


exports.load = function (request, response) {
	if (!(request instanceof http.IncomingMessage)) throw new Error ('First value passed to load() must be of type http.IncomingMessage');	
	if (!(response instanceof http.ServerResponse)) throw new Error ('Second value passed to load() must be of type http.ServerResponse');

	var handler = new CookieHandler (),
		cookie_str;
	
	if (cookie_str = request.headers.cookie) {
		var pairs = cookie_str.split (/\s*;\s*/);
		
		for (var i in pairs) {
			var data = pairs[i].split ('=', 2);
			handler.set_cookie (data[0], data[1]);
		}
	}
	

	var orig_sendHeader = response.sendHeader;
	
	response.sendHeader = function (status, headers) {
		var new_headers = [];
		
		if (headers.constructor == Object) {
			for (var i in headers) new_headers.push ([i, headers[i]]);
		} else if (headers.constructor == Array) {
			new_headers = headers;
		}

		var cookies = handler.get_all_cookies ();
		for (var i in cookies) new_headers.push (['Set-Cookie', cookies[i].to_cookie_string ()]); 
		
		orig_sendHeader.call (response, status, new_headers);
	};
	
	return handler;	
};

