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
    $('.nodesColorMode').on('change', function() {
      return window.force3DLayout.switchColorMode(parseInt(this.value, 10));
    });
    return window.parseInput = function() {
      var e, links, nodes, rawLinks, rawNodes;
      rawNodes = $("#nodesJSONSource").val();
      rawLinks = $("#linksJSONSource").val();
      nodes = null;
      links = null;
      try {
        nodes = JSON.parse(rawNodes);
        $("#nodesJSONSource").removeClass('inputText-invalid');
        window.force3DLayout.setLinks([]);
        window.force3DLayout.setNodes(nodes);
        try {
          links = JSON.parse(rawLinks);
          $("#linksJSONSource").removeClass('inputText-invalid');
          window.force3DLayout.setLinks(links);
          return window.force3DLayout.attachParticles();
        } catch (_error) {
          e = _error;
          $("#linksJSONSource").addClass('inputText-invalid');
          return console.log(e);
        }
      } catch (_error) {
        e = _error;
        console.log(e);
        return $("#nodesJSONSource").addClass('inputText-invalid');
      }
    };
  };

}).call(this);

//# sourceMappingURL=main.js.map
