// SmartHome Extension to demonstrate some simple REST functionality to // control a SmartHome based on Eclipse SmartHome, openHAB or QIVICON.// Works with ScratchX (http://scratchx.org/) using the URL// http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch.// 2015 Sascha Wolter (http://wolter.biz | @saschawolter)(function (ext) {    ext.send = function (value, url, callback) {        console.log("send");        $.ajax({            method: "PUT",            cache: false,            url: url,            data: value,            contentType: "text/plain",            success: function () {                callback();            },            error: function (xhr, textStatus, error) {                console.log(error);                callback();            }        });    };    ext.receive = function (url, callback) {        $.ajax({            method: "GET",            cache: false,            url: url,            dataType: "text",            success: function (data) {                console.log(data + " received");                callback(data);            },            error: function (xhr, textStatus, error) {                console.log(error);                callback();            }        });    };        var event_received = false;    var event_source = null;    // hat blocks will be repeatd as fast as possible, thus "filtering" needs to be done    ext.when_event = function (source) {        if (event_source != source) {            console.log("new event source");
            event_source = source;
            event_received = false;
            var eventSource = new EventSource(event_source);
            eventSource.addEventListener('message', function (eventPayload) {
                var event = JSON.parse(eventPayload.data);
                console.log(event.topic);
                console.log(event.type);
                console.log(event.payload);
                event_received = true;
            });        }        if (!event_received) {            return false;        }        event_received = false;        console.log("when_event");        return true;    }    ext._shutdown = function () {        // Cleanup extension if needed        console.log('Shutting down...');    };    ext._getStatus = function () {        // Report current extensions status        return { status: 2, msg: 'Ready' };    };    var descriptor = {        blocks: [            // Block type, block name, function name, opt. callback            ['w', 'put value %s to %s', 'send', 'ON', 'http://127.0.0.1:8080/rest/items/DemoSwitch/state'],            ['R', 'get value from %s', 'receive', 'http://127.0.0.1:8080/rest/items/DemoSwitch/state'],            ['h', 'when event from %s', 'when_event', "http://127.0.0.1:8080/rest/events?topics=smarthome/items/DemoSwitch/state"]        ],        url: 'https://github.com/wolter/ScratchX'    };    ScratchExtensions.register('SmartHome', descriptor, ext);})({});