var b;
var bctx;
var colors = ['#2c3e50', '#ff6666', '#f5ae42', '#444444'];
var minBubbleR = 10;
var maxBubbleR = 60;
var nBubbles = 35;

var clickEvent = false;
var lastTime = Date.now();
var bubbleArray = [];
var cursorX = -1000;
var cursorY = -1000;
var pagePosition = 0;
var multiplier = 1;

var updateCursorLocation = function(e) {
	cursorX = e.pageX;
	cursorY = e.pageY;
}

var isHovered = function(i, x, y) {
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
	var color = colors.shift();
	colors.push(color);
	return color;
}

var drawBubble = function(x, y, radius, color, opacity) {
	bctx.beginPath();
	bctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	bctx.closePath();
	bctx.fillStyle = color;
	bctx.globalAlpha = opacity;
	bctx.fill();
}

// Returns a random x coordinate with the specified portion of the window 
var getXWithinField = function(width, offset) {
	return b.width * (offset + (Math.random() * width));
}

// Returns a random buttons size
var generateRadius = function() {
	return Math.random() * (maxBubbleR - minBubbleR) + minBubbleR;
}

var initBubbles = function() {
	b = document.getElementById('bubbles');
	b.width = document.getElementById('bubbleWrapper').offsetWidth;
	b.height = document.getElementById('bubbleWrapper').offsetHeight;

	bctx = b.getContext('2d');

	// Listeners
	document.onmousemove = function(e) {
		updateCursorLocation(e);
	}

	document.onclick = function(e) {
		clickEvent = true;
	}

	for (var i = 0; i < nBubbles; i++) {
		if (i < nBubbles * 0.33) {
			var x = getXWithinField(0.2, 0);
			var r = generateRadius();
		}
		else if (i < nBubbles * 0.66) {
			var x = getXWithinField(0.6, 0.2);			
			var r = generateRadius();
		}
		else {
			var x = getXWithinField(0.2, 0.8);
			var r = generateRadius();
		}
		var y = Math.random() * window.innerHeight;
		var c = getColor();

		var opacity = (Math.random() * 0.2) + 0.1;

		drawBubble(x, y, r, c, opacity);

		bubbleArray.push({
			x: x,
			y: y,
			r: r,
			dr: 0,
			c: c,
			hover: false,
			opacity: opacity,
			popped: false,
			smiley: false
		});
	}

	var update = window.setInterval(function() {
		var currentTime = Date.now();
		if (currentTime - lastTime < 100) {
			updateBubbles(currentTime - lastTime);
		} 
		lastTime = currentTime;
	}, 60);
}

var updateBubbles = function(delta) {
	bctx.clearRect(0, 0, b.width, b.height);

	// Update for each bubble
	for (var i = 0; i < bubbleArray.length; i++) {

		// If click and bubble is hovered
		if (clickEvent && isHovered(i, cursorX, cursorY)) {
			bubbleArray[i].popped = true;
		}

		// If scrolled beyond 50px then increase speed multiplier
		// if (window.scrollY > 50) {
		// 	multiplier *= 1.005;
		// 	if (multiplier > 1000) {
		// 		multiplier = 1;
		// 	}
		// }
		// else {
		// 	multiplier = 1;
		// }

		// Set various speeds for bubbles
		if (i % 5 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - (1.5 / 60 * delta * multiplier);
		}
		else if (i % 2 == 0) {
			bubbleArray[i].y = bubbleArray[i].y - (0.9 / 60 * delta * multiplier);
		}
		else {
			bubbleArray[i].y = bubbleArray[i].y - (0.3 / 60 * delta * multiplier);
		}

		// If bubble is off the top of the screen, then randomly respawn bubbles
		if (bubbleArray[i].y < -65 && window.scrollY <= 10 && Math.random() < 0.001) {
			bubbleArray[i].y = window.innerHeight + 10 + maxBubbleR;
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
					bubbleArray[i].y = -65;
					bubbleArray[i].dr = 0;
					bubbleArray[i].opacity = (Math.random() * 0.2) + 0.1; 
				}
			}
		}
		else {
			// Hover effects
			if (isHovered(i, cursorX, cursorY)) {
				bubbleArray[i].hover = true;

				// Step up dr
				if (bubbleArray[i].dr < bubbleArray[i].r / 2) {
					bubbleArray[i].dr += 5;
				}
				else {
					bubbleArray[i].dr = bubbleArray[i].r / 2;
				}
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
			}
		}

		if (bubbleArray[i].opacity == 0) {
			bubbleArray[i].smiley = true;
			bubbleArray[i].popped = false;
			bubbleArray[i].opacity = (Math.random() * 0.2) + 0.1;
		}

		// Fade if necessary
		bctx.globalAlpha = bubbleArray[i].opacity;

		drawBubble(bubbleArray[i].x, bubbleArray[i].y, bubbleArray[i].r + bubbleArray[i].dr, bubbleArray[i].c);
	}

	clickEvent = false;
}