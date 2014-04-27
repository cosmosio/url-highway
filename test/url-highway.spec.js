/**
* @license url-highway https://github.com/cosmios/url-highway
*
* The MIT License (MIT)
*
* Copyright (c) 2014 Olivier Scherrer <pode.fr@gmail.com>
*/

require("quick-dom");

var UrlHighway = require("../index"),
    Highway = require("highway");

describe("UrlHighway initialization", function () {

    it("is a constructor function", function () {
        expect(typeof UrlHighway).toBe("function");
    });

    it("inherits from Emily's router", function () {
        var urlHighway = new UrlHighway();

        expect(Object.getPrototypeOf(urlHighway) instanceof Highway).toBe(true);
    });

});

describe("UrlHighway navigates to the route defined by the URL", function () {

    var urlHighway = null;

    beforeEach(function () {
        urlHighway = new UrlHighway();
    });

    it("has a default route to navigate to when none is supplied in the url", function () {
        expect(typeof urlHighway.getDefaultRoute).toBe("function");
        expect(urlHighway.getDefaultRoute()).toBe("");

        expect(typeof urlHighway.setDefaultRoute).toBe("function");
        expect(urlHighway.setDefaultRoute()).toBe(false);
        expect(urlHighway.setDefaultRoute("")).toBe(false);
        expect(urlHighway.setDefaultRoute("default")).toBe(true);

        expect(urlHighway.getDefaultRoute()).toBe("default");
    });

    it("can be given the default route on start", function () {
        urlHighway.start("home");

        expect(urlHighway.getDefaultRoute()).toBe("home");
    });

    it("has a default function for parsing a hashtag", function () {
        expect(typeof urlHighway.parse).toBe("function");

        expect(urlHighway.parse("hello/im/the/router")).toEqual(["hello", "im", "the", "router"]);
        expect(urlHighway.parse("#hello/im/the/router")).toEqual(["hello", "im", "the", "router"]);
    });

    it("parses the hashmark on start", function () {
        window.location.hash = "hello/im/the/router";

        expect(typeof urlHighway.start).toBe("function");
        spyOn(urlHighway, "parse");

        urlHighway.start();
        expect(urlHighway.parse).toHaveBeenCalledWith("#hello/im/the/router");
    });

    it("navigate to the route parsed on start", function () {
        window.location.hash = "hello/im/the/router";

        spyOn(urlHighway, "navigate");

        urlHighway.start();

        expect(urlHighway.navigate).toHaveBeenCalledWith("hello", "im", "the", "router");
    });

    it("navigates to the default route if no route is defined in the url", function () {
        window.location.hash = "";

        spyOn(urlHighway, "navigate");

        urlHighway.start("default");

        expect(urlHighway.navigate).toHaveBeenCalledWith("default");
    });

    it("listens to hash change on start", function () {
        spyOn(urlHighway, "bindOnHashChange");

        urlHighway.start();

        expect(urlHighway.bindOnHashChange).toHaveBeenCalled();
    });

    it("listens to hash change", function () {
        spyOn(window, "addEventListener");

        urlHighway.bindOnHashChange();

        expect(window.addEventListener).toHaveBeenCalledWith("hashchange", urlHighway.boundOnHashChange, true);
    });

    it("parses the new hash and navigates to the corresponding route when the hash changes", function () {
        var array = ["hello", "im", "the", "router"];
        window.location.hash = "hello/im/the/router";
        spyOn(urlHighway, "parse").andReturn(array);
        spyOn(urlHighway, "navigate");

        urlHighway.onHashChange();

        expect(urlHighway.parse).toHaveBeenCalledWith(window.location.hash);
        expect(urlHighway.navigate).toHaveBeenCalledWith("hello", "im", "the", "router");
    });

    it("navigates to the default route if the hash is empty", function () {
        window.location.hash = "";

        spyOn(urlHighway, "navigate");
        urlHighway.setDefaultRoute("default");

        urlHighway.onHashChange();

        expect(urlHighway.navigate).toHaveBeenCalledWith("default");
    });

    it("doesn't navigate on hash change when the route in the url has been set by a route change event", function () {
        urlHighway.onRouteChange("my", "route");
        spyOn(urlHighway, "navigate");

        urlHighway.onHashChange();

        expect(urlHighway.navigate).not.toHaveBeenCalled();
    });

});

describe("UrlHighway updates the URL when navigating", function () {

    var urlHighway = null;

    beforeEach(function () {
        urlHighway = new UrlHighway();
    });

    it("has a default function for serializing the arguments into a valid hashmark", function () {
        expect(typeof urlHighway.toUrl).toBe("function");

        expect(urlHighway.toUrl(["hello", "im", "the", "router"])).toBe("hello/im/the/router");
    });

    it("listens to route changes on start", function () {
        spyOn(urlHighway, "bindOnRouteChange");

        urlHighway.start();

        expect(urlHighway.bindOnRouteChange).toHaveBeenCalled();
    });

    it("listens to route changes", function () {
        spyOn(urlHighway, "watch");

        urlHighway.bindOnRouteChange();

        expect(urlHighway.watch).toHaveBeenCalledWith(urlHighway.onRouteChange, urlHighway);
    });

    it("updates the hash in the url on route change", function () {
        spyOn(urlHighway, "toUrl").andReturn("hello/im/the/router");

        urlHighway.onRouteChange("hello", "im", "the", "router");
        expect(urlHighway.toUrl.mostRecentCall.args[0]).toEqual(["hello", "im", "the", "router"]);

        expect(window.location.hash).toBe("#hello/im/the/router");
    });

    it("remembers the last route that has been navigated to", function () {
        window.location.hash = "my/route";

        urlHighway = new UrlHighway();

        expect(urlHighway.getLastRoute()).toBe(window.location.hash);

        urlHighway.onRouteChange("my", "route");

        expect(urlHighway.getLastRoute()).toBe(window.location.hash);
    });

});

describe("UrlHighway can be destroyed", function () {
    var urlHighway = null;

    beforeEach(function() {
        urlHighway = new UrlHighway();
    });

    it("removes the watch handler", function () {
        spyOn(urlHighway, "watch").andReturn(1337);
        spyOn(urlHighway, "unwatch");

        urlHighway.start();

        urlHighway.destroy();

        expect(urlHighway.unwatch).toHaveBeenCalledWith(1337);
    });

    it("removes the hashchange event listener", function () {
        spyOn(window, "removeEventListener");

        urlHighway.start();

        urlHighway.destroy();

        expect(window.removeEventListener).toHaveBeenCalledWith("hashchange", urlHighway.boundOnHashChange, true);
    });
});

describe("UrlHighway integration", function () {
    it("shouldn't navigate two times when navigate() is called and the router listens to changes on the hashmark", function () {
        var urlHighway = new UrlHighway();
        var spy = jasmine.createSpy();

        urlHighway.set("route", spy);

        urlHighway.start();

        urlHighway.navigate("route", 66);

        expect(spy.callCount).toBe(1);
    });
});
