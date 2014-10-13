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
    force3DLayout.on('nodesChanged', function() {
      var $target, color, node, nodes, _i, _len, _results;
      $target = $('#nodes ul');
      nodes = force3DLayout.getNodes();
      $target.empty();
      _results = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        color = force3DLayout.color(node.type);
        _results.push($target.append("<li style=\"border-bottom:1px " + color + " solid\">\n	<span class=\"nodeType\" style='background-color:" + color + "'>&emsp;</span>\n	" + node.name + "\n</li>"));
      }
      return _results;
    });
    force3DLayout.on('linksChanged', function() {
      var $target, colorCalled, colorCaller, link, links, _i, _len, _results;
      $target = $('#links ul');
      links = force3DLayout.getLinks();
      $target.empty();
      console.log(links);
      _results = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        colorCaller = force3DLayout.color(link.source.type);
        colorCalled = force3DLayout.color(link.target.type);
        _results.push($target.append("<li>\n	<span class=\"nodeType\" style='background-color:" + colorCaller + "'>&emsp;</span>\n	" + link.source.name + "\n	&rarr;\n	" + link.target.name + "\n	<span class=\"nodeType\" style='background-color:" + colorCalled + "'>&emsp;</span>\n</li>"));
      }
      return _results;
    });
    window.force3DLayout = force3DLayout;
    force3DLayout.start();
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
