// SmartHome Extension to demonstrate some simple REST functionality to // control a SmartHome based on Eclipse SmartHome, openHAB or QIVICON.// Works with ScratchX (http://scratchx.org/) using the URL// http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch.// 2015 Sascha Wolter (http://wolter.biz | @saschawolter)(function (ext) {    ext.send = function (value, url, callback) {        console.log("send");        $.ajax({            method: "PUT",            cache: false,            url: url,            data:value,            success: function () {                callback();            },            error: function (xhr, textStatus, error) {                console.log(error);                callback();            }        });    };    ext.receive = function (url, callback) {        console.log("receive");        $.ajax({            method: "GET",            cache: false,            url: url,            contentType: "text/plain",            dataType: "text/plain",            success: function (data) {                console.log(data);                callback(data);            },            error: function (xhr, textStatus, error) {                console.log(error);                callback();            }        });    };        var interval_when_state_is_changed = 1000;    var last_when_state_is_changed = 0;    // hat blocks will be repeatd as fast as possible, thus "filtering" needs to be done    ext.when_state_is_changed = function (varname) {        var now = Date.now();        if ((last_when_state_is_changed+interval_when_state_is_changed)>=now) {            return false;        }        last_when_state_is_changed = now;        console.log("when_state_is_changed");        return true;    }    ext._shutdown = function () {        // Cleanup extension if needed        console.log('Shutting down...');    };    ext._getStatus = function () {        // Report current extensions status        return { status: 2, msg: 'Ready' };    };    var descriptor = {        blocks: [            // Block type, block name, function name, opt. callback            ['w', 'put value %s to %s', 'send', 'ON', 'http://127.0.0.1:8080/rest/items/DemoSwitch/state'],            ['R', 'get value from %s', 'receive', 'http://127.0.0.1:8080/rest/items/DemoSwitch/state'],            ['h', 'when state %s is changed', 'when_state_is_changed', "XXX"]        ],        url: 'https://github.com/wolter/ScratchX'    };    ScratchExtensions.register('SmartHome', descriptor, ext);})({});