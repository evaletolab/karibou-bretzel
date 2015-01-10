
/*
 * create snorql directives
 */

angular.module('kk.ui',[]) 

.directive("menuToggle",[function() {

    function link(scope, element, attrs) {
      element.click(function () {
        $('.row-offcanvas').toggleClass('active')
        //$('html').toggleClass('overvlow-hidden')
      });
    }
    
    return {
      link: link
    };    
}])

.filter('clean', function () {
   return function(input) {
        if (!input) return "";
        return  input.replace(/[\.;-]/g, '');
   };
})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})