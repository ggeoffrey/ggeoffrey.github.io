(function() {
  var start;

  $(document).ready(function() {
    return start();
  });

  start = function() {
    var $tooltip, canvas, force3DLayout;
    canvas = '#mainTarget';
    $tooltip = $('#tooltip');
    $(document).on('mousemove', function(e) {
      return $tooltip.css({
        top: e.pageY + 10,
        left: e.pageX + 10
      });
    });
    force3DLayout = new Force3DLayout(canvas);
    force3DLayout.on('nodeHovered', function(node) {
      $tooltip.fadeIn('fast');
      $tooltip.find('.nodeName').text(node.name);
      return $tooltip.find('.nodeType').text(node.type);
    });
    force3DLayout.on('nodeBlur', function() {
      return $tooltip.fadeOut('fast');
    });
    window.force3DLayout = force3DLayout;
    $('.colorPickerBackground').ColorPicker({
      'onChange': function(hsb, hex, rgb) {
        return window.force3DLayout.setBackgroundColor('#' + hex);
      }
    });
    $('.colorPickerLights').ColorPicker({
      'onChange': function(hsb, hex, rgb) {
        return window.force3DLayout.setParticlesColor('#' + hex);
      }
    });
    return $('.nodesColorMode').on('change', function() {
      return window.force3DLayout.switchColorMode(parseInt(this.value, 10));
    });
  };

}).call(this);

//# sourceMappingURL=main.js.map
