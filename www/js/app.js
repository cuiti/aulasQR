// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var valid_numbers = ["2222","7777","8888","9999"];

qrApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  .controller("qrController", function($scope, $cordovaBarcodeScanner) {
    document.addEventListener("deviceready", function () {
    $scope.result="";
    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(successCallback, errorCallback);
        }});

    errorCallback = function (error) {
    alert("An error happened -> " + error);
    };
    successCallback= function(imageData){
      if (imageData.text=="" || imageData.text==null) {
          alert("texto en blanco");
          this.scanBarcode();
      }
      else{
        var index = valid_numbers.indexOf(imageData.text);    //chequea si el numero encontrado es valido
        if (index >= 0) {
          alert("El código " + imageData.text + " es valido! :D");
          $scope.result = imageData.text;
          $scope.$apply();
          if (imageData.cancelled) alert("Volve a internarlo!");
          else{
          document.getElementById("startScan").style.display = "none";
          document.getElementById("result").style.display = "";
        }
        }
        else {
          alert("El código encontrado no es valido: " + imageData.text);
        }
      }
    }
});
