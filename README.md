

cookies_node.js
===============

A simple cookie handling library for node.js.



API
---

### load (request, response)

Creates and returns a new CookieHandler object, loaded with cookies present in the request.



CookieHandler
-------------

### get_cookie (key)

Returns a Cookie object for the cookie with the given key. If a cookie with that key is not present, undefined is returned. 

### set_cookie (key, value, options)

Updates the cookie with the given key to the new value. If a cookie with that key is not present, it is created. The options here are the same as those passed to the Cookie constructor (see below).

### add_cookie (cookie)

Adds a cookie object to those to be sent.

### get_all_cookies ()

Returns a hash of all cookies.



Cookie
------

### Cookie (key, value, options)

Constructor. Creates a cookie to be sent with the given key and value. An object with any of the following properites may also be given: 

* _expires_ A Date object representing the date and time when the cookie expires.
* _path_ The path of the cookie.
* _domain_ The domin of the cookie.
* _http_only_ A boolean value representing the HttpOnly flag. (default: false)

### key

The cookie's key.

### value

The cookie's value.

### expires

A Date object representing the cookie's expiry. Undefined if session cookie.

### path

The cookie's path value.

### domain

The cookie's domain.

### http_only

Boolean value representing the cookie's HttpOnly flag



Example usage
-------------

	var http = require ('http'),
		cookies = require ("./cookies_node");

	http.createServer (function (request, response) {

		// Load cookies
		var my_cookies = cookies.load (request, response);
	
		
		// Get cookie value
		var visit_count = parseInt (my_cookies.get_cookie ('visit_count') || 0, 10);
				
	
		// Set cookie value
		my_cookies.set_cookie ('visit_count', visit_count + 1);
		
	
		// Set cookie that expires in 1 hour
		var date_expires = new Date ();
		date_expires.setHours (date_expires.getHours () + 1);
		my_cookies.set_cookie ('visit_count', visit_count + 1, { expires: date_expires });
		
	
		// Alternate method to set cookie
		var mr_cookie = new cookies.Cookie ('name', 'Samuel Smith');
		mr_cookie.domain = 'example.com';
		mr_cookie.http_only = true;
	
		my_cookies.add_cookie (mr_cookie);
	
	
		// Cookies are automatically sent back to browser when header sent	
		response.sendHeader (200, { "Content-Type": "text/plain" });
		response.sendBody ('Visit count: ' + visit_count);
		response.finish ();

	}).listen (8000);

