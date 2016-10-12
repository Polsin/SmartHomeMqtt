'use strict';

angular.module('homepi.login', [])

.controller('LoginCtrl', function($state, $scope, $rootScope, $ionicPopup, Socket) {
  //$scope.loginData = {host:'192.168.1.250',port:'9001',user:'app',password:'app3869',devicemac:'5CCF7F090B4A'};
  $scope.loginData = { host:'wifi-thermo.cloudapp.net',
                       port:'9001',
                       user:'app',
                       password:'app3869',
                       duration:0,
                       devicemac2:'18FE34DAF3F1',
                       appmac:'AABBCCDDEEFF'
                     };

  $scope.showAlert = function() {
          $ionicPopup.alert({
            title: 'Error',
            content: 'User and/or password wrong!'
          }).then(function(res) {
            console.log('Alert showed...');
          });
        };

  $scope.tryLogin = function() {
          console.log('Try to log in ' + $scope.loginData.user);
          if($scope.loginData.host && $scope.loginData.port){
              window.localStorage.setItem('host',$scope.loginData.host);
              window.localStorage.setItem('port',$scope.loginData.port);
              window.localStorage.setItem('user',$scope.loginData.user);
              window.localStorage.setItem('password',$scope.loginData.password);
              //window.localStorage.setItem('duration',$scope.loginData.duration);
              window.localStorage.setItem('devicemac2',$scope.loginData.devicemac2);
              window.localStorage.setItem('appmac',$scope.loginData.appmac);
              Socket.connect($scope.loginData.host,$scope.loginData.port,$scope.loginData.user,$scope.loginData.password);
              console.log('Successfully logged in ' + $scope.loginData.user);
              $state.go('list');
              $scope.txReady = 1;
          }else{
              $scope.showAlert();
          }
  };

  $scope.logout = function() {
    console.log('Successfully logged out ' + window.localStorage['user']);
    //window.localStorage.clear();
    $state.go('login');
  };
});
