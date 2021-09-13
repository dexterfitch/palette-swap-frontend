function loadScript(url) {    
  var body = document.getElementsByTagName('body')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  body.appendChild(script);
}

loadScript('./src/nodes.js');
loadScript('./src/index.js');
loadScript('./src/patterns.js');
loadScript('./src/palette.js');