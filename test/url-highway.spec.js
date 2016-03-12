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

                it("Then tells what the last route is", function () {
                    expect(urlHighway.getLastRoute()).toEqual("#route1/interstate/D.C");
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

        describe("When overriding the method to parse the url", function () {
            beforeEach(function () {
                urlHighway.parse = jasmine.createSpy("parse").and.returnValue(["parsme"]);
            });

            describe("And the hash changes", function () {
                beforeEach(function () {
                    window.location.hash = "parsme";
                });

                it("Then calls the new parse method with the proper arguments", function (done) {
                    setTimeout(function () {
                        expect(urlHighway.parse).toHaveBeenCalledWith("#parsme");
                        done();
                    }, 0);
                });
            });
        });

        describe("When overriding the method to set the url", function () {
            beforeEach(function () {
                urlHighway.toUrl = jasmine.createSpy("toUrl").and.returnValue("this/route/is/formatted");
            });

            describe("And we navigate to a route", function () {
                beforeEach(function () {
                    urlHighway.navigate("format", "this", "route");
                });

                it("Then calls the new toURl method", function () {
                    expect(urlHighway.toUrl).toHaveBeenCalledWith(["format", "this", "route"]);
                });

                it("Then sets the url with the formatted route", function () {
                    expect(window.location.hash).toEqual("#this/route/is/formatted");
                });
            });
        })
    });
});
