/**
 *
 * Example test script for Hello OpenFin App using Mocha, CHAI and WebdriverIO (http://webdriver.io)
 *
 * wedriver.io assumes server URL is /wd/hub.  So if testing with chromedriver directly, it needs to run as
 *     chromedriver --url-base=/wd/hub
 *
 */

"use strict";

var should = require('chai').should(),
    webdriver = require('webdriverio'),
    assert = require("assert"),
    config = require("../../tests_config");


describe('Hello OpenFin App testing', function() {
    var client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(function() {
        var driverOptions = {
            desiredCapabilities: {
                browserName: 'chrome',
                'chromeOptions': {
                          args: [],
                          extensions: [],
                            debuggerAddress: 'localhost:9090'
                        }
            },
            host: '10.211.55.4',
            port: 9515,
            logLevel: 'debug'
        };
        client = webdriver.remote(driverOptions).init();
    });

    after(function(done) {
        // needs "done" here to give time to run .end()
        client.end(function() {
            done();
        });
    });

    it('Switch to Hello OpenFin Main window', function(done) {
        should.exist(client);
        client.getTabIds(function(result) {
            done();
        });
    });


    function switchWindow(windowHandle, callback) {
        client.switchTab(windowHandle, function(err) {
            should.not.exist(err);
            client.title(function (err, result) {
                should.not.exist(err);
                callback(result.value);
            });
        });
    }

    function switchWindowByTitle(windowTitle, done) {
        client.getTabIds(function(err, handles) {
            should.not.exist(err);
            var handleIndex = 0;
            var checkTitle = function (title) {
                if (title === windowTitle) {
                    done();
                } else {
                    handleIndex++;
                    if (handleIndex < handles.length) {
                        switchWindow(handles[handleIndex], checkTitle);
                    } else {
                        throw new Error("Window not found " + title);
                    }
                }
            };
            switchWindow(handles[handleIndex], checkTitle);
        });
    }

    it('Switch to Hello OpenFin Main window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin", done);
    });


    it("Find notification button", function(done) {
        should.exist(client);
        client.element("#desktop-notification", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            notificationButton = result.value;
            done();
        });
    });

    it("Click notification button", function(done) {
        should.exist(client);
        should.exist(notificationButton);
        client.elementIdClick(notificationButton.ELEMENT, function(err, result) {
            should.not.exist(err);
            done();
        });
    });


    it("Find CPU Info button", function(done) {
        should.exist(client);
        client.element("#cpu-info", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            cpuInfoButton = result.value;
            done();
        });
    });

    it("Click CPU Info button", function(done) {
        should.exist(client);
        should.exist(cpuInfoButton);
        client.elementIdClick(cpuInfoButton.ELEMENT, function(err, result) {
            should.not.exist(err);
            client.pause(3000, function() {
                done();
            });
        })
    });

    it('Switch to CPU Info window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin CPU Info", done);
    });


    it("Find Exit button for CPU Info window", function(done) {
        should.exist(client);
        client.element("#close-app", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            cpuInfoExitButton = result.value;
            done();
        });


    });

    it("Click CPU Info Exit button", function(done) {
        should.exist(client);
        should.exist(cpuInfoExitButton);
        client.elementIdClick(cpuInfoExitButton.ELEMENT, function(err, result) {
            should.not.exist(err);
            done();
        })
    });



});