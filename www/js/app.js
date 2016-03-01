// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var valid_numbers = ["2222","7777","8888","9999"];

qrApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova', 'cordovaHTTP'])

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

   .controller("qrController", function($scope, $cordovaBarcodeScanner,$cordovaToast) {
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
          $scope.scanBarcode();
      }
      else{
        var index = valid_numbers.indexOf(imageData.text);    //chequea si el numero encontrado es valido
        if (index >= 0) {
          if(imageData.text.match(/^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi)){ //si es una URL, redirecciona
            alert("es una url");
            //window.location.href =imageData.text;
          }
          else {
            alert("no es una url");
          $scope.result = imageData.text;
          if (imageData.cancelled) alert("Volve a internarlo!");
          else{
          document.getElementById("startScan").style.display = "none";
          document.getElementById("result").style.display = "";
        }
        }
      }
        else {
          $cordovaToast.show('     El código no es válido     ', 'long', 'center')
          .then(function(success) {
                      setTimeout(function(){$scope.scanBarcode();}, 2000);          

          }, function (error) {
          // error
          });

        }
      }
    }
})

  .controller("serverController", function($scope,cordovaHTTP){

    $scope.getData = function(uri){
      var username = "movilesbluetooth";
      var password = "3mFh5qNR";
      var url = "http://movilesbluetooth.php.info.unlp.edu.ar/alumnos/1";
      cordovaHTTP.useBasicAuth(username,password);

      cordovaHTTP.get(url).then(function(response) {
              alert(response.data);
              $scope.response_data = response.data;
            });

    }


  });
