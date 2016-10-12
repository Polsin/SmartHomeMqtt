'use strict';

angular.module('homepi.device', [])


.controller('DeviceListCtrl', function($scope, $state, $rootScope, $stateParams, Socket) {

$scope.togglePowerSW = function() {
    if($scope.powerToggle == true) {
      $scope.powerToggle = false;
    }else{
      $scope.powerToggle = true;
    }
    console.log('testToggle changed to '+$scope.powerToggle);

    if($scope.powerToggle){
        Socket.publish('/query/device/18FE34DAF3F1/app/AABBCCDDEEFF','<18FE34DAF3F1FF00010201010001F3>');
        console.log('sent = <18FE34DAF3F1FF00010201010001F3>');
        $scope.txDataSend.data = 'sent = '+'<18FE34DAF3F1FF00010201010001F3>';
      } else{
          Socket.publish('/query/device/18FE34DAF3F1/app/AABBCCDDEEFF','<18FE34DAF3F1FF00010201010000F4>');
          console.log('sent = <18FE34DAF3F1FF00010201010000F4>');
          $scope.txDataSend.data = 'sent = '+'<18FE34DAF3F1FF00010201010000F4>';
   }
};

$scope.modeSW = function() {


};

$scope.fanSW = function() {


};



  $scope.txtName = $stateParams.uname; // room name
  $scope.txtMcaddr = $stateParams.mcaddr; // mac address
  window.localStorage.setItem('devicemac2',$scope.txtMcaddr);

//.controller('DeviceListCtrl', function($scope, $state, $rootScope, Socket) {
  $scope.txDataSend = {data:''};
  $scope.rxData = {data:''};
  $scope.txReady = 1;
  $scope.txData = '';
  $scope.topic = '';
  $scope.duration = window.localStorage['duration'];
  $scope.devicemac2 = window.localStorage['devicemac2'];
  $scope.appmac = window.localStorage['appmac'];
  $scope.devices = [
      //{type:"dimmer", value:0,name:$scope.devicemac,topic:"/query/device/"+$scope.devicemac+"/app/"+$scope.appmac,id:"dimmer"}, //1
      //{type:"dimmer", value:0,name:"Status",topic:"/query/device/"+$scope.devicemac+"/app/"+$scope.appmac,id:"dimmer_read"}, //2
      {type:"thermostat", value:25,name:$scope.devicemac2,topic:"/query/device/"+$scope.devicemac2+"/app/"+$scope.appmac,id:"thermostat"}, //3
      {type:"thermostat", value:25,name:"Status",topic:"/query/device/"+$scope.devicemac2+"/app/"+$scope.appmac,id:"thermo_read"} //4
                   ];

  console.log("device : " + window.localStorage['devicemac2']);

  $scope.back = function() {
     console.log('back..!' );
     //window.localStorage.removeItem("devicemac2");
     $state.go('list');
   };

  $scope.logout = function() {
    console.log('Successfully logged out ' + window.localStorage['user']);
    //window.localStorage.clear();
    $state.go('login');
  };




  $scope.calLRC = function(sBuf) {
      var bufLRC = 0;
      var i = 0;
      for(i=0;i<sBuf.length;i=i+2){
          bufLRC = bufLRC+parseInt(sBuf.substring(i, 2+i),16);
      }
      bufLRC = ((bufLRC^0xFF)+1) & 0xFF;

    return ("0" + bufLRC.toString(16).toUpperCase()).slice(-2);
      //return bufLRC.toString(16).toUpperCase();

  };

  $scope.change = function (device) {
    console.log('changed: ' + device.id + ' value: ' + device.value + ' mac: ' + device.name);

    if((device.type == 'dimmer')&&(device.id == 'dimmer')){
        $scope.hexString1 = parseInt(device.value).toString(16).toUpperCase();
        $scope.hexString1 = ("0" + $scope.hexString1).slice(-2);
        var duration_lo = parseInt($scope.duration);
        var duration_hi = 0;
        if (parseInt($scope.duration)>255){
            duration_lo = parseInt($scope.duration) % 256;
            duration_hi = (parseInt($scope.duration) / 256)&255;
        }
        $scope.hexString2 = duration_lo.toString(16).toUpperCase();
        $scope.hexString2 = ("0" + $scope.hexString2).slice(-2);

        $scope.hexString3 = duration_hi.toString(16).toUpperCase();
        $scope.hexString3 = ("0" + $scope.hexString3).slice(-2);

        $scope.pre_txData = device.name+'FF00010212120001FFFFFFFFFFFF'+$scope.hexString1+$scope.hexString2+$scope.hexString3+'FFFFFFFFFFFFFFFF';
        $scope.pre_txData = '<'+$scope.pre_txData+$scope.calLRC($scope.pre_txData)+'>';
        //$scope.txData = '<'+$scope.pre_txData+$scope.calLRC($scope.pre_txData)+'>';

        $scope.topic = device.topic;

        if($scope.txReady){
            $scope.txReady=0;
            $scope.txData = $scope.pre_txData;
            Socket.publish($scope.topic,$scope.txData);
            console.log('sent0 = '+$scope.txData);
            $scope.txDataSend.data = 'sent0 = '+$scope.txData;
        }
    }
    if((device.type == 'thermostat')&&(device.id == 'thermostat')){
        var setTemp = (parseInt(device.value)-15)*2;
        $scope.hexString1 = setTemp.toString(16).toUpperCase();
        $scope.hexString1 = ("0" + $scope.hexString1).slice(-2);

        var power = 1;
        //if($scope.powerToggle == false){
        //power = 0 ;
        //}
        $scope.hexString2 = power.toString(16).toUpperCase();
        $scope.hexString2 = ("0" + $scope.hexString2).slice(-2);

        $scope.pre_txData = device.name+'FF000102070700'+$scope.hexString2+'FFFF'+$scope.hexString1+'FFFF01';
        $scope.pre_txData = '<'+$scope.pre_txData+$scope.calLRC($scope.pre_txData)+'>';
        //$scope.txData = '<'+$scope.pre_txData+$scope.calLRC($scope.pre_txData)+'>';

        $scope.topic = device.topic;

        if($scope.txReady){
            $scope.txReady=0;
            $scope.txData = $scope.pre_txData;
            Socket.publish($scope.topic,$scope.txData);
            console.log('sent0 = '+$scope.txData);
            $scope.txDataSend.data = 'sent0 = '+$scope.txData;
        }
    }


    /*
    var payload = device.value;
    if(device.type == 'on_off' && (device.value == true || device.value == false)){
        payload = JSON.stringify(device.value);
    }
    Socket.publish(device.topic + '/set',payload);
    */
  };


  Socket.onMessage(function(topic, payload) {
    //console.log('incoming topic: ' + topic + ' and payload: ' + payload);
      $scope.rxData.data = payload;
/*
      if(topic=='/response/app/'+$scope.appmac+'/device/'+$scope.devicemac){
         var pre_rxData = $scope.devicemac+'FF00010212';
          pre_rxData = '['+pre_rxData+$scope.calLRC(pre_rxData)+']';

         var pre_rxBusyData = $scope.devicemac+'FF000305';
          pre_rxBusyData = '['+pre_rxBusyData+$scope.calLRC(pre_rxBusyData)+']';

          if(payload==pre_rxData){//ack write data
              console.log('ack write data '+payload);
              $scope.txReady=1;
              if($scope.txData==$scope.pre_txData){
                $scope.txData='';
                $scope.pre_txData='';
              }else{
                $scope.txReady=0;
                $scope.txData = $scope.pre_txData;
                Socket.publish($scope.topic,$scope.txData);
                console.log('sent1 = '+$scope.txData);
                $scope.txDataSend.data = 'sent1 = '+$scope.txData;
              }

         }else
         if(payload==pre_rxBusyData){//busy
             console.log('busy '+payload);
             $scope.txReady=1;

             if($scope.txData==''){
             }else{
                 $scope.txReady=0;
                 Socket.publish($scope.topic,$scope.txData);
                 console.log('sent1.1 = '+$scope.txData);
                 $scope.txDataSend.data = 'sent1.1 = '+$scope.txData;
             }

         }else{//read data
             console.log('read data'+payload);
             $scope.txReady=1;
          if(payload.substring(1, 13)==$scope.devicemac){
              var rssi = parseInt(payload.substring(67, 69),16)*-1;
              var brightness = parseInt(payload.substring(45, 47),16);
              var power = payload.substring(32, 33);

              $scope.devices[1].value = brightness;
              $scope.devices[1].name = "[rssi="+rssi+"] [power="+power+"]";
          }
         }
      }else
*/
      if(topic=='/response/app/'+$scope.appmac+'/device/'+$scope.devicemac2){
         var pre_rxData = $scope.devicemac2+'FF00010207';
          pre_rxData = '['+pre_rxData+$scope.calLRC(pre_rxData)+']';

         var pre_rxBusyData = $scope.devicemac2+'FF000305';
          pre_rxBusyData = '['+pre_rxBusyData+$scope.calLRC(pre_rxBusyData)+']';

          if(payload==pre_rxData){//ack write data
              console.log('ack write data '+payload);
              $scope.txReady=1;
              if($scope.txData==$scope.pre_txData){
                $scope.txData='';
                $scope.pre_txData='';
              }else{
                $scope.txReady=0;
                $scope.txData = $scope.pre_txData;
                Socket.publish($scope.topic,$scope.txData);
                console.log('sent1 = '+$scope.txData);
                $scope.txDataSend.data = 'sent1 = '+$scope.txData;
              }

         }else
         if(payload==pre_rxBusyData){//busy
             console.log('busy '+payload);
             $scope.txReady=1;

             if($scope.txData==''){
             }else{
                 $scope.txReady=0;
                 Socket.publish($scope.topic,$scope.txData);
                 console.log('sent1.1 = '+$scope.txData);
                 $scope.txDataSend.data = 'sent1.1 = '+$scope.txData;
             }

         }else{//read data
             console.log('read data'+payload);
             $scope.txReady=1;
          if(payload.substring(1, 13)==$scope.devicemac2){
              var rssi = parseInt(payload.substring(67, 69),16)*-1;
              var power = payload.substring(32, 33);
              var setTemp = parseInt(payload.substring(37, 39),16)/2+15;
              var roomTemp = (parseInt(payload.substring(45, 47),16)+(parseInt(payload.substring(47, 49),16)*256))/10;
              var fanSpeed = parseInt(payload.substring(35, 37),16);
              var acMode = parseInt(payload.substring(43, 45),16);
              var FAN = ["Auto","High","Med","Low"];
              var MODE = ["Fan","Cool","Dry","Heat","Auto"];
              //if(power==1){
              //$scope.powerToggle = true
              //}
              $scope.devices[1].value = setTemp;
              $scope.devices[1].name = "[rssi="+rssi+"] [Room="+roomTemp+"] [Fan="+FAN[fanSpeed]+"] [Mode="+MODE[acMode]+"]";
              //console.log("Room Temp : " + roomTemp);

          }
         }
      }else{//from broadcast
          console.log('broadcast data '+payload);
          $scope.txReady=1;
          //if(payload.substring(1, 13)==$scope.devicemac){
          //    var rssi = parseInt(payload.substring(67, 69),16)*-1;
          //    var brightness = parseInt(payload.substring(45, 47),16);
          //    var power = payload.substring(32, 33);
          //    $scope.devices[1].value = brightness;
          //    $scope.devices[1].name = "[rssi="+rssi+"] [power="+power+"]";
          //}else
          if(payload.substring(1, 13)==$scope.devicemac2){
              var rssi = parseInt(payload.substring(67, 69),16)*-1;
              var power = payload.substring(32, 33);
              var setTemp = parseInt(payload.substring(37, 39),16)/2+15;
              var roomTemp = (parseInt(payload.substring(45, 47),16)+(parseInt(payload.substring(47, 49),16)*256))/10;
              var fanSpeed = parseInt(payload.substring(35, 37),16);
              var acMode = parseInt(payload.substring(43, 45),16);
              var FAN = ["Auto","High","Med","Low"];
              var MODE = ["Fan","Cool","Dry","Heat","Auto"];
              //if(power==1){
              //$scope.powerToggle = true
              //}
              $scope.devices[1].value = setTemp;
              $scope.devices[1].name = "[rssi="+rssi+"] [Room="+roomTemp+"] [Fan="+FAN[fanSpeed]+"] [Mode="+MODE[acMode]+"]";
              console.log("Set Temp : " + setTemp);
              console.log("Room Temp : " + roomTemp);

              document.getElementById('roomTemp').innerHTML = roomTemp;
              document.getElementById('setTemp').innerHTML = setTemp;
              document.getElementById('setMode').innerHTML = FAN[fanSpeed];
              document.getElementById('setFan').innerHTML = MODE[acMode];

              if(power==1){
              document.getElementById('setPower').innerHTML = "Power On";
              $scope.powerToggle = true;
              } else {
              document.getElementById('setPower').innerHTML = "Power Off";
              $scope.powerToggle = false;
              }



              //var strTemp = roomTemp;
              //var res1 = strTemp.substring(0, 1);
              //var res2 = strTemp.substring(1, 2);
              //figures[0].src = 'img/' + res1 + '.png';
              //figures[1].src = 'img/' + res2 + '.png';

          }
      }
    /*
    var splitTopic = topic.split("/");
    if(splitTopic[2] == 'config'){
        console.log('Load device configuration from MQTT...' + payload);
        $scope.devices = JSON.parse(payload);
    }

    angular.forEach($scope.devices, function(device) {
        //Search for corresponding device and update the value
        if(device.topic == topic){
          var isTrueSet = (payload === 'true');
          var isFalseSet = (payload === 'false');
          if(isTrueSet){
            device.value = true;
          }else if(isFalseSet){
            device.value = false;
          }else{
            device.value = payload;
          }
        }
    });
    */
    $scope.$apply();
  });

})
