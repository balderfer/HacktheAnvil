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

	$(window).resize(function(event) {
		b.width = $('.body-wrapper').width();
		b.height = $('.body-wrapper').height();
	});

	document.onmousemove = function(e) {
		var bIndexes = getNearbyBubbles(e.pageX, e.pageY);
		for (var i = 0; i < bubbleArray.length; i++) {
			if (bubbleArray[i].doubled) {
				bubbleArray[i].r *= (1 / 1.5);
				bubbleArray[i].doubled = false;
				bubbleArray[i].faded = false;
			}
		}
		for (var i = 0; i < bIndexes.length; i++) {
			if (!bubbleArray[bIndexes[i]].doubled) {
				bubbleArray[bIndexes[i]].r *= 1.5;
				bubbleArray[bIndexes[i]].doubled = true;
				bubbleArray[bIndexes[i]].faded = true;
			}
		}
	}
});

var getNearbyBubbles = function(x, y) {
	var nearbyBubbleIndexes = [];
	for (var i = 0; i < bubbleArray.length; i++) {
		var distance = calculateDistance(x, y, bubbleArray[i].x, bubbleArray[i].y);
		if (distance < bubbleArray[i].r) {
			nearbyBubbleIndexes.push(i);
		}
	}
	return nearbyBubbleIndexes;
}

var calculateDistance = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

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
	for (var i = 0; i < 35; i++) {
		if (i < 13) {
			var x = (Math.random() * (b.width / 5)) + (0 * b.width / 5);
			var r = Math.random() * 60;
		}
		else if (i < 24) {
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
			c: c,
			doubled: false,
			faded: false
		});
	}

	var update = window.setInterval(function() { updateBubbles() }, 30);
}

var updateBubbles = function() {
	// alert('updateBubbles');
	bctx.clearRect(0, 0, b.width, b.height);
	for (var i = 0; i < 35; i++) {
		if (i % 5 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - 0.9;
		}
		if (i % 2 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - 0.3;
		}
		else {
			bubbleArray[i].y = bubbleArray[i].y - 0.9;
		}
		if (bubbleArray[i].y < -65) {
			bubbleArray[i].y = $(window).height() + 65;
		}

		// Fade if necessary
		if (bubbleArray[i].faded) {
			bctx.globalAlpha = 0.5;
		}
		else {
			bctx.globalAlpha = 1;
		}

		drawCircle(b, bctx, bubbleArray[i].x, bubbleArray[i].y, bubbleArray[i].r, bubbleArray[i].c);
	}
}