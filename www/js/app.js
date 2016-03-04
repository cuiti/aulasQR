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
var url ="http://movilesbluetooth.php.info.unlp.edu.ar/";

var qrApp = angular.module('starter', ['cordovaHTTP', 'ionic','ngCordova']);


qrApp.run(function($ionicPlatform, InteractWithServer, $cordovaNetwork) {
  $ionicPlatform.ready(function() {
    InteractWithServer.initialize();
    if ($cordovaNetwork.isOnline()){
      //InteractWithServer.getCodigos();
    }
  });
});

qrApp.factory("QRmodel", function(){
  var codigos=[];
  var QR = {
    id: "",
    hash: "",
    title: "",
    description: "",
    imagetitle: ""};

  return{
    getQRs : function(){
            return codigos;},

    setQR: function(item){
    QR.id=item.id;
    QR.hash=item.hash;
    QR.title=item.title;
    QR.description=item.description;
    QR.imagetitle=item.imagetitle;
    codigos.push(QR);}
  };
});

qrApp.service("InteractWithServer",function(cordovaHTTP, QRmodel){
    var username = "movilesbluetooth";
    var password = "3mFh5qNR";
    this.initialize = function(){
      cordovaHTTP.useBasicAuth(username,password);
    };
    this.getCodigos = function(){
      cordovaHTTP.get(url+"qrcodes/",{},{})
        .then(function(response) {
          response=JSON.parse(response.data);
          $.map(response, function(item) { QRmodel.setQR(item);});
          var codi=QRmodel.getQRs();
          angular.forEach(codi, function(value, key) {
              window.localStorage.setItem(value.hash,JSON.stringify(value));
          });
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
        }});
    validation = function(key){
      alert("validando" + key);
      var codigo = window.localStorage.getItem(key);
      alert(codigo);
      if (codigo != false) {
        return JSON.parse(cD);
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

qrApp.controller("serverController", function($scope, cordovaHTTP, InteractWithServer){
     $scope.getData = function(){
        alert("adentro del scope");
       InteractWithServer.getCodigos();
    }

  });
