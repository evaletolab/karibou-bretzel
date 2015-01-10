!function(e){"use strict";e.module("kb.config",[]).factory("config",[function(){var e={};return e}])}(angular),angular.module("kk.ui",[]).directive("menuToggle",[function(){function e(e,t){t.click(function(){$(".row-offcanvas").toggleClass("active")})}return{link:e}}]).filter("clean",function(){return function(e){return e?e.replace(/[\.;-]/g,""):""}}).filter("reverse",function(){return function(e){return e.slice().reverse()}}),angular.module("snorql.service",[]).factory("snorql",["$http","$q","$timeout","$location","config",function(e,t,r,n,a){var s={property:"SELECT DISTINCT ?resource ?value\nWHERE { ?resource <URI_COMPONENT> ?value }\nORDER BY ?resource ?value",clazz:"SELECT DISTINCT ?instance\nWHERE { ?instance a <URI_COMPONENT> }\nORDER BY ?instance",describe:"SELECT DISTINCT ?property ?hasValue ?isValueOf\nWHERE {\n  { <URI_COMPONENT> ?property ?hasValue }\n  UNION\n  { ?isValueOf ?property <URI_COMPONENT> }\n}\nORDER BY (!BOUND(?hasValue)) ?property ?hasValue ?isValueOf",query:"SELECT DISTINCT * WHERE {\n  ?s ?p ?o\n}\nLIMIT 10",sparqlEndpoint:a.sparql.endpoint,sparqlUrlExamples:a.sparql.examples},i={"default-graph-uri":null,"named-graph-uri":null,output:"json"},o={html:"application/sparql-results+json,*/*",json:"application/sparql-results+json,*/*",xml:"application/sparql-results+xml,*/*",csv:"application/sparql-results+csv,*/*"},l=function(){var e="";for(var t in a.sparql.prefixes){var r=a.sparql.prefixes[t];e=e+"PREFIX "+t+": <"+r+">\n"}return e},u=function(){this.examples=[],this.tags=[],this.result={head:[],results:[]},this.query=s.query,this.examplesUrl=s.sparqlUrlExamples,this.$promise=t.when(this),this.canceler=t.defer()};return u.prototype.reset=function(){this.canceler.resolve(),this.result={head:[],results:[]},this.canceler=t.defer()},u.prototype.endpoint=function(){return s.sparqlEndpoint},u.prototype.loadExamples=function(){var t=this;return this.examples.length?this:(this.$promise=this.$promise.then(function(){return e({method:"GET",url:t.examplesUrl})}),this.$promise.then(function(e){var r=0;t.examples=e.data,t.examples.forEach(function(e){e.index=r++,e.tags&&e.tags.split(",").forEach(function(e){-1==t.tags.indexOf(e.trim())&&t.tags.push(e)})})}),this)},u.prototype.updateQuery=function(e){return this.query=e["class"]?s.clazz.replace(/URI_COMPONENT/g,e["class"]):e.property?s.property.replace(/URI_COMPONENT/g,e.property):e.describe?s.describe.replace(/URI_COMPONENT/g,e.describe):e.query||s.query,this.query},u.prototype.executeQuery=function(n,a){var u=this;if(!n||""===n)return u;this.reset();var c=angular.extend(i,a,{query:n});c.query=l()+"\n"+c.query;var p={Accept:o[c.output]},d=s.sparqlEndpoint;if("html"!==c.output){u.reset();var h=t.defer();return window.location=d+"?"+$.param(c),this.$promise=h.promise,r(function(){h.resolve(this)},200),u}return c.output="json",this.$promise=e({method:"GET",url:d,params:c,headers:p,timeout:this.canceler.promise}),this.$promise.then(function(e){u.result=e.data,console.log(u.result)}),this},u.prototype.prefixes=function(){return a.sparql.prefixes},u.prototype.SPARQLResultFormatter=function(){return new function(e,t){this._json=e,this._variables=this._json.head.vars||{},this._results=this._json.results.bindings||[],this._namespaces=t,this.toDOM=function(){var e=document.createElement("table");e.className="queryresults",e.appendChild(this._createTableHeader());for(var t=0;t<this._results.length;t++)e.appendChild(this._createTableRow(this._results[t],t));return e},this._getLinkMaker=function(e){return"property"==e?function(e){return"?property="+encodeURIComponent(e)}:"class"==e?function(e){return"?class="+encodeURIComponent(e)}:function(e){return"?describe="+encodeURIComponent(e)}},this._createTableHeader=function(){for(var e=document.createElement("tr"),t=!1,r=0;r<this._variables.length;r++){var n=document.createElement("th");n.appendChild(document.createTextNode(this._variables[r])),e.appendChild(n),"namedgraph"==this._variables[r]&&(t=!0)}if(t){var n=document.createElement("th");n.appendChild(document.createTextNode(" ")),e.insertBefore(n,e.firstChild)}return e},this._createTableRow=function(e,t){var r=document.createElement("tr");r.className=t%2?"odd":"even";for(var n=null,a=0;a<this._variables.length;a++){var s=this._variables[a];o=document.createElement("td"),o.appendChild(this._formatNode(e[s],s)),r.appendChild(o),"namedgraph"==this._variables[a]&&(n=e[s])}if(n){var i=document.createElement("a");i.href="javascript:snorql.switchToGraph('"+n.value+"')",i.appendChild(document.createTextNode("Switch"));var o=document.createElement("td");o.appendChild(i),r.insertBefore(o,r.firstChild)}return r},this._formatNode=function(e,t){return e?"uri"==e.type?this._formatURI(e,t):"bnode"==e.type?this._formatBlankNode(e,t):"literal"==e.type?this._formatPlainLiteral(e,t):"typed-literal"==e.type?this._formatTypedLiteral(e,t):document.createTextNode("???"):this._formatUnbound(e,t)},this._formatURI=function(e,t){var r=document.createElement("span");r.className="uri";var n=document.createElement("a");n.href=this._getLinkMaker(t)(e.value),n.title="<"+e.value+">",n.className="graph-link";var a=this._toQName(e.value);a?(n.appendChild(document.createTextNode(a)),r.appendChild(n)):(s=e.value.match(/\.(png|gif|jpg)(\?.+)?$/),s?(o=document.createElement("img"),o.src=e.value,o.title=e.value,o.className="media",n.appendChild(o),r.appendChild(n)):(n.appendChild(document.createTextNode(e.value)),r.appendChild(document.createTextNode("<")),r.appendChild(n),r.appendChild(document.createTextNode(">"))));var s=e.value.match(/^(https?|ftp|mailto|irc|gopher|news):/);if(s){r.appendChild(document.createTextNode(" "));var i=document.createElement("a");i.href=e.value;var o=document.createElement("img");o.src="img/link.png",o.alt="["+s[1]+"]",o.title="Go to Web page",i.appendChild(o),r.appendChild(i)}return r},this._formatPlainLiteral=function(e){var t='"'+e.value+'"';return e["xml:lang"]&&(t+="@"+e["xml:lang"]),document.createTextNode(t)},this._formatTypedLiteral=function(e){var t='"'+e.value+'"';if(e.datatype&&(t+="^^"+this._toQNameOrURI(e.datatype)),this._isNumericXSDType(e.datatype)){var r=document.createElement("span");return r.title=t,r.appendChild(document.createTextNode(e.value)),r}return document.createTextNode(t)},this._formatBlankNode=function(e){return document.createTextNode("_:"+e.value)},this._formatUnbound=function(){var e=document.createElement("span");return e.className="unbound",e.title="Unbound",e.appendChild(document.createTextNode("-")),e},this._toQName=function(e){for(var t in this._namespaces){var r=this._namespaces[t];if(0==e.indexOf(r))return t+":"+e.substring(r.length)}return null},this._toQNameOrURI=function(e){var t=this._toQName(e);return null==t?"<"+e+">":t},this._isNumericXSDType=function(e){for(var t=0;t<this._numericXSDTypes.length;t++)if(e==this._xsdNamespace+this._numericXSDTypes[t])return!0;return!1},this._xsdNamespace="http://www.w3.org/2001/XMLSchema#",this._numericXSDTypes=["long","decimal","float","double","int","short","byte","integer","nonPositiveInteger","negativeInteger","nonNegativeInteger","positiveInteger","unsignedLong","unsignedInt","unsignedShort","unsignedByte"]}(this.result,this.prefixes())},new u}]),function(e){"use strict";function t(e,t){var r=[];for(var n in e)r.push(t?e[n][t]:e[n]);return console.log(r,e),r}function r(e,r,n,a){e.recipes=[],e.product={},e.selected={idx:-1,product:{},labels:[]},e.selectRecipe=function(r){var n=t(e.recipes[r].base).reduce(function(e,t){return e+t},0);e.selected.idx=r,e.selected.labels=Object.keys(e.recipes[r].commande),e.selected.recipe=e.recipes[r],e.selected.values={sumBase:n,sumComm:0},$(".row-offcanvas").removeClass("active")},e.computeSum=function(){var t=0;if(-1===e.selected.idx)return t;for(var r in e.selected.recipe.commande)t+=e.selected.recipe.commande[r]*(e.product[r]||0);e.selected.values.sumComm=t,e.selected.values.factor=t/e.selected.values.sumBase;for(var r in e.selected.recipe.base)r=r.toLowerCase(),e.selected.values[r]=e.selected.recipe.base[r]*e.selected.values.factor;return e.selected.values.litter=e.selected.values.eau,console.log(e.selected.values),t},a({method:"GET",url:"recettes.json"}).then(function(t){e.recipes=t.data})}function n(e,t,r){r.interceptors.push("errorInterceptor"),e.when("/",{title:"welcome to snorql",templateUrl:"partials/home.html"}),t.html5Mode(!0)}function a(e,t){return{request:function(t){return t||e.when(t)},requestError:function(t){return e.reject(t)},response:function(t){return t||e.when(t)},responseError:function(r){return r&&0===r.status&&(t.error="The API is not accessible"),r&&401===r.status&&(t.error="You are not authorized to access the resource. Please login or review your privileges."),r&&404===r.status&&(t.error="URL not found"),r&&r.status>=500&&(t.error="Request Failed"),e.reject(r)}}}e.module("karibou",["ngRoute","kb.config","kk.ui"]).controller("AppCtrl",r).config(n).factory("errorInterceptor",a),r.$inject=["$scope","$timeout","$location","$http","config","$log"],n.$inject=["$routeProvider","$locationProvider","$httpProvider"],a.$inject=["$q","$rootScope","$location"]}(angular);