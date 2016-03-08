// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var url ="http://movilesbluetooth.php.info.unlp.edu.ar/";

var qrApp = angular.module('starter', ['cordovaHTTP', 'ionic','ngCordova']);


qrApp.run(function($ionicPlatform, InteractWithServer, $cordovaNetwork) {
  $ionicPlatform.ready(function() {
    InteractWithServer.initialize();
    if ($cordovaNetwork.isOnline()){
      InteractWithServer.getCodigos();
    }
  });
});

qrApp.factory("QRmodel", function(){
  var codigos=[];

  return{
    getQRs : function(){
            return codigos;},

    setQR: function(item){
    codigos.push(item);}
  };
});


qrApp.service("InteractWithServer",function(cordovaHTTP, $ionicLoading, QRmodel){
    var key = "bW92aWxlc2JsdWV0b290aDozbUZoNXFOUg==";
    var value = "Basic "+key;

    this.initialize = function(){
      cordovaHTTP.setHeader("Authorization", value);
    };
    this.getCodigos = function(){
      $ionicLoading.show({
         template: '<ion-spinner icon="lines"></ion-spinner>',
         showBackdrop: true,
         maxWidth: 300,
         showDelay: 0
         });
      cordovaHTTP.get(url+"qrcodes/",{},{})
        .then(function(response) {
          response=JSON.parse(response.data);
          $.map(response, function(item) {QRmodel.setQR(item);});
          var codi=QRmodel.getQRs();
          angular.forEach(codi, function(value, key) {
              window.localStorage.setItem(value.hash,JSON.stringify(value));
          });
          $ionicLoading.hide();
        });
    };
});
qrApp.controller("qrController", function($scope, $cordovaBarcodeScanner,$cordovaToast) {
    document.addEventListener("deviceready", function () {
    $scope.title="";
    $scope.description="";
    $scope.imagetitle="";

      $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(successCallback, errorCallback);
        }},function(){});
    validation = function(key){
      var codigo = window.localStorage.getItem(key);
      if (codigo != null) {
        return JSON.parse(codigo);
      }
      else return false;
    };

    errorCallback = function (error) {
    alert("An error happened -> " + error);
    };
    successCallback= function(imageData){
      if (imageData.text=="" || imageData.text==null) {
          $scope.scanBarcode();
      }
      else{
        var datoQR = validation(imageData.text);    //chequea si el numero encontrado es valido
        if (datoQR != false) {
          if(datoQR.description.match(/^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi)){ //si es una URL, redirecciona
            cordova.InAppBrowser.open(datoQR.description, "_self", "location=yes");
          }
          else {
            if (!imageData.cancelled){
            $scope.title = datoQR.title;
            $scope.description = datoQR.description;
            $scope.imagetitle= datoQR.imagetitle;
            document.getElementById("startScan").style.display = "none";
            document.getElementById("result").style.display = "";
          }
            else alert("volve a intentarlo");
        }
      }
        else {
            document.getElementById("startScan").style.display = "";
            document.getElementById("result").style.display = "none";

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
