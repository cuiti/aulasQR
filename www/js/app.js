// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var valid_numbers = ["039134ef682c6accd7bfda726caa7305", //aula2-1 a la 2-5
                      "e51ae93ce758643968b56ad582728726",
                      "452e96dba9cb2bad8156ab6460c1c657",
                      "0addd19f7d26c3ef48b669183312d5e6",
                      "261dc577773c7690ca34f36ea8c04327"];
var qrApp = angular.module('starter', ['cordovaHTTP', 'ionic','ngCordova']);

qrApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    window.localStorage.setItem("039134ef682c6accd7bfda726caa7305", "http://google.com");
    window.localStorage.setItem("e51ae93ce758643968b56ad582728726", "Aula de posgrado 2");
    window.localStorage.setItem("452e96dba9cb2bad8156ab6460c1c657", "Aula de posgrado 3");
    window.localStorage.setItem("0addd19f7d26c3ef48b669183312d5e6", "Aula de posgrado 4");
    window.localStorage.setItem("261dc577773c7690ca34f36ea8c04327", "Aula de posgrado 5");


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
});

qrApp.controller("qrController", function($scope, $cordovaBarcodeScanner,$cordovaToast) {
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
          datoQR=localStorage.getItem(imageData.text);
          if(datoQR.match(/^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi)){ //si es una URL, redirecciona
            cordova.InAppBrowser.open(datoQR, "_self", "location=yes");
          }
          else {
          $scope.result = datoQR;
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
});

qrApp.controller("serverController", function($scope, cordovaHTTP){
      console.log("app3 on");
     $scope.getData = function(){
        console.log("adentro del scope");
        var username = "movilesbluetooth";
        var password = "3mFh5qNR";
        var url = "http://cuiti.esy.es/meses/";

       // cordovaHTTP.useBasicAuth(username,password);
       cordovaHTTP.get()
        cordovaHTTP.get(url, {message: "test"} , {}).then(function(response) {
              alert(response.data);
              $scope.response_data = response.data;
            });
    }

  });
