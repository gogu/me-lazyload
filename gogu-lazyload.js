angular.module('me-lazyload', [])
  .directive('lazySrc', ['$window', function($window) {
    var win = $window
      , $win = angular.element(win);
    var els = []
      , fireLoad = false;

    function showImg() {
      if(els.length <= 0) {
        fireLoad = winUnbind();
        return;
      }

      els.forEach(function($el, index) {
        if(isVisible($el)) {
          $el.attr('src', $el.lazySrc);
          $el.on('load', function() {
            this.style.opacity = 1;
          });
          els.splice(index, 1);
        } else {
          return;
        }
      });
    }

    function isVisible($el) {
      var el = $el[0]
        , viewHeight = win.innerHeight
        , elClientRect = el.getBoundingClientRect()
        , elHeight = elClientRect.height
        , elTop = elClientRect.top;
      if(!angular.isNumber(elTop)) return false;

      return (elTop + elHeight > 0 && elTop < viewHeight) ? true : false;
    }


    function winBind() {
      $win.bind('scroll', showImg);
      $win.bind('resize', showImg);

      return true;
    }

    function winUnbind() {
      $win.unbind('scroll', showImg);
      $win.unbind('resize', showImg);

      return false;
    }

    return {
      scope: {
        lazySrc: '@'
      },
      link: function(scope, $el, attr) {
        fireLoad = fireLoad ? fireLoad : winBind();

        scope.$watch('lazySrc', showImg);

        $el.css({
          'opacity': '0',
          'transition': '.3s ease-in opacity',
          '-webkit-transition': '.3s ease-in opacity'
        });
        $el.lazySrc = scope.lazySrc;
        els.push($el);

        scope.$on('$destroy', function() {
          fireLoad = winUnbind();
        });
      }
    };
  }]);
