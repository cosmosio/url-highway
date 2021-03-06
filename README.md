url-highway
=============

A url based router. It's based on [Highway](https://github.com/cosmosio/highway), which is a simple and extensible router, and adds it url support. 
The router can listen to hash changes to navigate to a route, or update the hash when navigating to a new route.

Installation
============

```bash
npm install url-highway
```

How to use
==========

Require and initialize a url based router:

```js
var Highway = require("url-highway");

var highway = new Highway();
```

Starting/stopping the router to allow it to watch for hash changes in the url

```js
urlHighway.start();
urlHighway.stop();
```

Let's define routes:

```js
highway.set("route", function onRouteCalled(param1) {
    // Do something when navigating to "route".
}, /* scope, optional */);

highway.set("anotherRoute", function onAnotherRouteCalled(param1, param2, param3) {
    // Do something when navigating to anotherRoute
}, /* optional scope*/);
```

By default, when navigating to a route, url highway will update the hash:

```js
// Navigating to "route", giving 66 as a parameter. As many parameters as necessary can be given to navigate.
highway.navigate("route", 66);

//Then url highway updates the hash:
window.location.hash; // #route/66
```

When navigating to a route with several parameters:

```js
highway.navigate("anotherRoute", "interstate", 66, "D.C.");

// Then the hash will be:
window.location.hash; // #anotherRoute/interstate/66/D.C.
````

Also, when the hash is updated (programmatically or from the address bar), to #route/127/MI

```js
window.location.hash = "#route/127/MI";

// Will call navigate:
highway.navigate("route", "127", "MI");
```

We can also get the last route

```js
// returns something like: #route/127/MI
highway.getLastRoute();


// We can use parse on it, returns ["route", "127", "MI"]
highway.parse("#route/127/MI");
```


Highway's other features are available too:
====================

Removing a route:

```js
var handle = highway.set("route", ...);

highway.unset(handle);
```

Navigating in the history:

```js
highway.back();
highway.forward();

highway.go(-2);
```

CHANGELOG
=========

###1.0.0 - 12 MAR 2016

 * Breaking change: `destroy()` renamed to `stop()` 
 * Update unit tests

###0.0.5 - 21 FEB 2016

 * It's now possible to register routes without giving a callback.
 * Improved API for getting previous routes


LICENSE
=======

MIT
