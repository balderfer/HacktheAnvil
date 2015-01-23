var b;
var bctx;
var color = 1;
var bubbleArray = [];
var cursorX = -1000;
var cursorY = -1000;
var pagePosition = 0;
var multiplier = 1;

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
		cursorX = e.pageX;
		cursorY = e.pageY;
	}

	document.onclick = function(e) {
		for (var i = 0; i < bubbleArray.length; i++) {
			if (isNearbyBubble(i, cursorX, cursorY)) {
				bubbleArray[i].popped = true;
			}
		}
	}

	// $(window).scroll(function(event) {
	// 	pagePosition = $('body').scrollTop();
	// 	console.log(pagePosition);
	// });
});

var isNearbyBubble = function(i, x, y) {
	var distance = calculateDistance(x, y, bubbleArray[i].x, bubbleArray[i].y);
	if (distance < bubbleArray[i].r) {
		return true;
	}
	return false;
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
	var numberOfButtons = 35;
	for (var i = 0; i < numberOfButtons; i++) {
		if (i < numberOfButtons * 0.33) {
			var x = (Math.random() * (b.width / 5)) + (0 * b.width / 5);
			var r = Math.random() * 50 + 10;
		}
		else if (i < numberOfButtons * 0.66) {
			var x = (Math.random() * (3 * b.width / 5)) + (1 * b.width / 5);			
			var r = Math.random() * 50 + 10;
		}
		else {
			var x = (Math.random() * (b.width / 5)) + (4 * b.width / 5);
			var r = Math.random() * 50 + 10;
		}
		var y = Math.random() * $(window).height();
		var c = getColor();

		var opacity = (Math.random() * 0.2) + 0.1;

		bctx.globalAlpha = opacity;

		drawCircle(b, bctx, x, y, r, c);
		bubbleArray.push({
			x: x,
			y: y,
			r: r,
			c: c,
			hover: false,
			opacity: opacity,
			dr: 0,
			popped: false
		});
	}

	var update = window.setInterval(function() { updateBubbles() }, 30);
}

var updateBubbles = function() {
	// alert('updateBubbles');
	bctx.clearRect(0, 0, b.width, b.height);
	for (var i = 0; i < bubbleArray.length; i++) {
		if (i % 5 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - (0.9 * multiplier);
		}
		if (i % 2 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - (0.3 * multiplier);
		}
		else {
			bubbleArray[i].y = bubbleArray[i].y - (0.9 * multiplier);
		}
		if (bubbleArray[i].y < -65 && $(window).scrollTop() < 10 && Math.random() < 0.001) {
			multiplier = 1;
			bubbleArray[i].y = $(window).height() + 65;
			bubbleArray[i].dr = 0;
			bubbleArray[i].opacity = (Math.random() * 0.2) + 0.1; 
		}

		if (bubbleArray[i].popped) {
			if (bubbleArray[i].dr < 1000) {
				bubbleArray[i].dr += 60;
			}
			if (bubbleArray[i].opacity > 0) {
				bubbleArray[i].opacity -= 0.02;
				if (bubbleArray[i].opacity < 0) {
					bubbleArray[i].opacity = 0;
					bubbleArray[i].popped = false;
					bubbleArray[i].y = $(window).height() + 65;
					bubbleArray[i].dr = 0;
					bubbleArray[i].opacity = (Math.random() * 0.2) + 0.1; 
				}
			}
		}
		else {
			// Hover effects
			if (isNearbyBubble(i, cursorX, cursorY)) {
				bubbleArray[i].hover = true;

				// Step up dr
				if (bubbleArray[i].dr < bubbleArray[i].r / 2) {
					bubbleArray[i].dr += 5;
				}
				else {
					bubbleArray[i].dr = bubbleArray[i].r / 2;
				}

				// Step down opacity
				// if (bubbleArray[i].opacity > 0.5) {
				// 	bubbleArray[i].opacity -= 0.09;
				// }
				// else {
				// 	bubbleArray[i].opacity = 0.5;
				// }	
			}
			else {
				bubbleArray[i].hover = false;
				
				// Step down dr
				if (bubbleArray[i].dr > 0) {
					bubbleArray[i].dr -= 5;
				}
				else {
					bubbleArray[i].dr = 0;
				}

				// Step up opacity
				// if (bubbleArray[i].opacity < 1) {
				// 	bubbleArray[i].opacity += 0.09;
				// }
				// else {
				// 	bubbleArray[i].opacity = 1;
				// }			
			}
		}

		// Fade if necessary
		bctx.globalAlpha = bubbleArray[i].opacity;

		// var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

		drawCircle(b, bctx, bubbleArray[i].x, bubbleArray[i].y, bubbleArray[i].r + bubbleArray[i].dr, bubbleArray[i].c);
	}
}