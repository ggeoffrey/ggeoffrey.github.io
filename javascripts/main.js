(function() {
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

}).call(this);

//# sourceMappingURL=main.js.map
