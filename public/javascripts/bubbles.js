var b;
var bctx;
var color = 1;
var bubbleArray = [];

$(document).ready(function() {
	b = document.getElementById('bubbles');

	b.width = $('.body-wrapper').width();
	b.height = $('.body-wrapper').height();

	bctx = b.getContext('2d');

	initBubbles();
});

// setInterval(updateBubbles(), 100)

var getColor = function() {
	var rand = Math.random();
	if (color == 1) {
		color++;
		return '#2c3e50';
	}
	else if (color == 2) {
		color++;
		return '#ff6666';
	}
	else if (color == 3) {
		color++;
		return '#f5ae42';
	}
	else if (color == 4) {
		color++;
		return '#444444';
	}
	else {
		color = 2;
		return '#2c3e50';
	}
}

var drawCircle = function(c, ctx, x, y, r, c) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fillStyle = c;
	ctx.fill();
}

var initBubbles = function() {
	for (var i = 0; i < 15; i++) {
		if (i < 5) {
			var x = (Math.random() * (b.width / 5)) + (0 * b.width / 5);
			var r = Math.random() * 60;
		}
		else if (i < 10) {
			var x = (Math.random() * (3 * b.width / 5)) + (1 * b.width / 5);			
			var r = Math.random() * 20;
		}
		else {
			var x = (Math.random() * (b.width / 5)) + (4 * b.width / 5);
			var r = Math.random() * 60;
		}
		var y = Math.random() * $(window).height();
		var c = getColor();

		drawCircle(b, bctx, x, y, r, c);
		bubbleArray.push({
			x: x,
			y: y,
			r: r,
			c: c
		});
	}

	var update = window.setInterval(function() { updateBubbles() }, 30);
}

var updateBubbles = function() {
	// alert('updateBubbles');
	bctx.clearRect(0, 0, b.width, b.height);
	for (var i = 0; i < 15; i++) {
		if (i % 5 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - 0.9;
		}
		if (i % 2 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - 0.3;
		}		else {
			bubbleArray[i].y = bubbleArray[i].y - 0.9;
		}
		drawCircle(b, bctx, bubbleArray[i].x, bubbleArray[i].y, bubbleArray[i].r, bubbleArray[i].c);
	}
}