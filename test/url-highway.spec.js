/**
 * @license url-highway https://github.com/cosmios/url-highway
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 Olivier Scherrer <pode.fr@gmail.com>
 */

var UrlHighway = require("../index");

describe("Given UrlHighway", function () {
    var urlHighway;

    beforeEach(function () {
        urlHighway = new UrlHighway();
    });

    describe("When started", function () {
        beforeEach(function () {
            urlHighway.start();
        });

        describe("And a route is defined", function () {
            var route1Spy;

            beforeEach(function () {
                route1Spy = jasmine.createSpy("route1");

                urlHighway.set("route1", route1Spy);
            });

            describe("When navigating to the route", function () {
                beforeEach(function () {
                    urlHighway.navigate("route1", "interstate", "D.C");
                });

                it("Then calls the handlers with the proper parameters", function () {
                    expect(route1Spy).toHaveBeenCalledWith("interstate", "D.C");
                });

                it("Then updates the hash", function () {
                    expect(window.location.hash).toEqual("#route1/interstate/D.C");
                });
            });
        });

        describe("When navigating to a route that's not defined", function () {
            beforeEach(function () {
                urlHighway.navigate("route2", "highway", 115);
            });

            it("Then still updates the hash", function () {
                expect(window.location.hash).toEqual("#route2/highway/115");
            });
        });

        describe("When stopping the router", function () {
            var oldHash;

            beforeEach(function () {
                oldHash = window.location.hash;
                urlHighway.stop();
            });

            describe("And navigating to a route", function () {
                beforeEach(function () {
                    urlHighway.navigate("route3", "avenue", 6);
                });

                it("Then doesn't update the hash", function () {
                    expect(window.location.hash).toEqual(oldHash);
                });
            });
        });
    });
});
