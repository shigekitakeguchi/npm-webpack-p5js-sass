var p5 = require('p5');

function sketch(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  }

  p.draw = function() {
	  if (p.mouseIsPressed) {
	    p.fill(0);
	  } else {
	    p.fill(255);
	  }
    p.ellipse(p.mouseX, p.mouseY, 80, 80);
  }
}

var app = new p5(sketch, document.body);
