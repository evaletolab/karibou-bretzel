(function (angular, undefined) {'use strict';

function Object_values(objects, f){
  var r=[]
  for(var key in objects) {
      if(f)r.push(objects[key][f]);else r.push(objects[key]);
  }
  console.log(r,objects)
  return r;
}

/**
 * create application recette and load deps
 */
var app = angular.module('karibou', [
  'ngRoute','kb.config','kk.ui'
])
  .controller('AppCtrl',AppCtrl)
  .config(appConfig)
  .factory('errorInterceptor',errorInterceptor);


//
// implement application  
AppCtrl.$inject=['$scope','$timeout','$location','$http','config','$log'];
function AppCtrl($scope, $timeout, $location, $http, config, $log) {
  $scope.recipes=[];
  $scope.product={};
  $scope.selected={idx:-1,product:{},labels:[]};

  $scope.selectRecipe=function (idx) {
    var sumBase=Object_values($scope.recipes[idx].base).reduce(function(p,c){return p+c},0)
    $scope.selected.idx=idx
    $scope.selected.labels=Object.keys($scope.recipes[idx].commande)
    $scope.selected.recipe=$scope.recipes[idx];
    $scope.selected.values={
      sumBase:sumBase,
      sumComm:0
    }
    $('.row-offcanvas').removeClass('active')
    //.map(function(r){return r.title})
  }

  $scope.computeSum=function(){
    var sum=0;
    if($scope.selected.idx===-1) return sum;
    // sum of product
    for (var p in $scope.selected.recipe.commande){
      sum=sum+$scope.selected.recipe.commande[p]*($scope.product[p]||0)
    }
    $scope.selected.values.sumComm=sum;
    $scope.selected.values.factor=sum/$scope.selected.values.sumBase

    // values of base
    for (var p in $scope.selected.recipe.base){
      p=p.toLowerCase();
      $scope.selected.values[p]=$scope.selected.recipe.base[p]*$scope.selected.values.factor
    }
    $scope.selected.values.litter=$scope.selected.values['eau']

    console.log($scope.selected.values)
    return sum
  }

  $http({method:'GET',url:'recettes.json'}).then(function(recettes){
    $scope.recipes=recettes.data;
  });



};


/**
 * ANGULAR BOOTSTRAP
 */
appConfig.$inject=['$routeProvider','$locationProvider','$httpProvider'];
function appConfig($routeProvider, $locationProvider, $httpProvider) {

    // intercept errors
    $httpProvider.interceptors.push('errorInterceptor')


    // List of routes of the application
    $routeProvider
        .when('/', {title: 'welcome to snorql', templateUrl: 'partials/home.html'});


    // Without serve side support html5 must be disabled.
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix = '!';
};

errorInterceptor.$inject=['$q', '$rootScope', '$location'];
function errorInterceptor($q, $rootScope, $location) {
  return {
      request: function (config) {
          return config || $q.when(config);
      },
      requestError: function(request){
          return $q.reject(request);
      },
      response: function (response) {
          return response || $q.when(response);
      },
      responseError: function (response) {
          if (response && response.status === 0) {
            $rootScope.error="The API is not accessible";
          }
          if (response && response.status === 401) {
            $rootScope.error="You are not authorized to access the resource. Please login or review your privileges.";
          }
          if (response && response.status === 404) {
            $rootScope.error="URL not found";
          }
          if (response && response.status >= 500) {
            $rootScope.error="Request Failed";
          }
          return $q.reject(response);
      }
  };
};


})(angular);