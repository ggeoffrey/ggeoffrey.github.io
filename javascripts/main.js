(function() {
  var canvas, force3DLayout;

  canvas = '#mainTarget';

  force3DLayout = new Force3DLayout(canvas);

  force3DLayout.on('nodeHovered', function(node) {
    return console.log(node);
  });

  window.force3DLayout = force3DLayout;

}).call(this);

//# sourceMappingURL=main.js.map
