!function(e){"use strict";e.module("kb.config",[]).factory("config",[function(){var e={};return e}])}(angular),angular.module("kk.ui",[]).directive("menuToggle",[function(){function e(e,r){r.click(function(){$(".row-offcanvas").toggleClass("active")})}return{link:e}}]).filter("clean",function(){return function(e){return e?e.replace(/[\.;-]/g,""):""}}).filter("reverse",function(){return function(e){return e.slice().reverse()}}),function(e){"use strict";function r(e,r){var t=[];for(var o in e)t.push(r?e[o][r]:e[o]);return console.log(t,e),t}function t(e,t,o,n){e.recipes=[],e.product={},e.selected={idx:-1,product:{},labels:[]},e.selectRecipe=function(t){var o=r(e.recipes[t].base).reduce(function(e,r){return e+r},0);e.selected.idx=t,e.selected.labels=Object.keys(e.recipes[t].commande),e.selected.recipe=e.recipes[t],e.selected.values={sumBase:o,sumComm:0},$(".row-offcanvas").removeClass("active")},e.customField=function(e){return e&&-1!==e.toLowerCase().indexOf("autre")},e.computeSum=function(){var r=0;if(-1===e.selected.idx)return r;for(var t in e.selected.recipe.commande)r+=e.selected.recipe.commande[t]*(e.product[t]||0);e.selected.values.sumComm=r,e.selected.values.factor=r/e.selected.values.sumBase;for(var t in e.selected.recipe.base)t=t.toLowerCase(),e.selected.values[t]=e.selected.recipe.base[t]*e.selected.values.factor;return e.selected.values.litter=e.selected.values.eau,console.log(e.selected.values),r},n({method:"GET",url:"recettes.json"}).then(function(r){e.recipes=r.data})}function o(e,r,t){t.interceptors.push("errorInterceptor"),e.when("/",{title:"welcome to snorql",templateUrl:"partials/home.html"}),r.html5Mode(!0)}function n(e,r){return{request:function(r){return r||e.when(r)},requestError:function(r){return e.reject(r)},response:function(r){return r||e.when(r)},responseError:function(t){return t&&0===t.status&&(r.error="The API is not accessible"),t&&401===t.status&&(r.error="You are not authorized to access the resource. Please login or review your privileges."),t&&404===t.status&&(r.error="URL not found"),t&&t.status>=500&&(r.error="Request Failed"),e.reject(t)}}}e.module("karibou",["ngRoute","kb.config","kk.ui"]).controller("AppCtrl",t).config(o).factory("errorInterceptor",n),t.$inject=["$scope","$timeout","$location","$http","config","$log"],o.$inject=["$routeProvider","$locationProvider","$httpProvider"],n.$inject=["$q","$rootScope","$location"]}(angular);