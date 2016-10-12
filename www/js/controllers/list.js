angular.module('homepi.list',[])
  .controller('ListCtrl',function ($scope,$state) {

    $scope.MyDataArray = [
      {
        uname:'Bed room',
        info:'air condition',
        mcaddr:'18FE34DAF3F1'
      },
      {
        uname:'Living room',
        info:'air condition',
        mcaddr:'18FE34DAF3EF'
      },
    ]

    $scope.btnDevice = function (data) {
      $state.go('devices',{uname:data.uname,mcaddr:data.mcaddr})
    }


    $scope.btnAddDevice = function (data) {
      $state.go('adddevice')
    }

    $scope.btnSetting = function() {
      $state.go('login');
    };

})
