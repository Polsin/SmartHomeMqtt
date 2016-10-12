angular.module('homepi.services', ['ngResource'])

.factory('Socket', function($rootScope) {

    var service = {};
    var client = {};
    function calLRC(sBuf) {
      var bufLRC = 0;
      var i = 0;
      for(i=0;i<sBuf.length;i=i+2){
          bufLRC = bufLRC+parseInt(sBuf.substring(i, 2+i),16);
      }
      bufLRC = ((bufLRC^0xFF)+1) & 0xFF;

    return ("0" + bufLRC.toString(16).toUpperCase()).slice(-2);

    };
    service.connect = function(host, port, user, password) {
        var options = {
          username: user,
          password: password
        };
        console.log("Try to connect to MQTT Broker " + host + " with user " + user);
        client = mqtt.createClient(parseInt(port),host,options);
        //client.subscribe(user+"/#");
        //client.subscribe("/broadcast/#");
        
        //client.subscribe("/broadcast/device/"+window.localStorage['devicemac']);
        client.subscribe("/broadcast/device/"+window.localStorage['devicemac2']);
        client.subscribe("/response/app/"+window.localStorage['appmac']+"/#");

        //var payload_read_dimmer = window.localStorage['devicemac']+"FF00000015";
        //payload_read_dimmer = "<"+payload_read_dimmer+calLRC(payload_read_dimmer)+">";

        var payload_read_ac = window.localStorage['devicemac2']+"FF00000015";
        payload_read_ac = "<"+payload_read_ac+calLRC(payload_read_ac)+">";

        //client.publish("/query/device/"+window.localStorage['devicemac']+"/app/"+window.localStorage['appmac'],payload_read_dimmer, {retain: false});//read status

        client.publish("/query/device/"+window.localStorage['devicemac2']+"/app/"+window.localStorage['appmac'],payload_read_ac, {retain: false});//read status


        client.on('error', function(err) {
            console.log('error!', err);
            client.stream.end();
        });

        client.on('message', function (topic, message) {
            console.log("message");
          service.callback(topic,message);
        });
    }

    service.publish = function(topic, payload) {
        client.publish(topic,payload, {retain: false});//normal
        //client.publish(topic,"", {retain: true}); //delete retain
        //client.publish(topic,"", {retain: false}); //delete retain
        console.log('publish-Event sent '+ payload + ' with topic: ' + topic + ' ' + client);
    }

    service.onMessage = function(callback) {
        service.callback = callback;
    }

    return service;
});
