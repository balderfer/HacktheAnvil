$(document).ready(function() {
	drawSlants();
	$(window).resize(function(event) {
		drawSlants();
	});
});

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

var spawnBubbles = function() {
	var spawn = document.getElementsByClassName('spawn-bubbles');

	for (i in spawn) {
		if (spawn[i].nodeName != 'DIV') {
			break;
		}
		var order = shuffle([0, 1, 2, 3, 4, 5]);

		for (var j = 0; j < 6; j++) {
			var bubble = document.createElement('DIV');
			bubble.className = 'bubble';

			// Random size
			var random = Math.random();
			if (j == 0 || j == 4) {
				bubble.className += ' bubble-xs';
			}
			else if (j == 3 || j == 5) {
				bubble.className += ' bubble-sm';
			}
			else if (j == 2) {
				bubble.className += ' bubble-md';
			}
			else {
				bubble.className += ' bubble-lg';
			}

			// Random background
			random = Math.random();
			if (random < 0.2) {
				bubble.className += ' bg-blue';
			}
			else if (random < 0.4) {
				bubble.className += ' bg-pink';
			}
			else if (random < 0.6) {
				bubble.className += ' bg-white';
			}
			else if (random < 0.8) {
				bubble.className += ' bg-yellow';
			}
			else {
				bubble.className += ' bg-gray';
			}

			// Random right
			bubble.style.right = (Math.random() * $(spawn[i]).width() / 6) + (j * $(spawn[i]).width() / 6) + 'px';

			// Random top
			if (j == 0) {
				k = 4
			}
			else if (j == 1) {
				k = 2
			}
			else if (j == 2) {
				k = 1
			}
			else if (j == 3) {
				k = 5
			}
			else if (j == 4) {
				k = 0
			}
			else {
				k = 3
			}
			var top = (Math.random() * $(spawn[i]).height() / 6) + (order.pop() * $(spawn[i]).height() / 6) + 'px';
			top = parseInt(top, 10) + 100;
			bubble.style.top = top + 'px';
			console.log(top);

			var spawnTop = $(spawn[i]).offset().top;
			var spawnBottom = $(spawn[i]).height() + spawnTop;

			var dh = $(document).height();

			var pos1 = bubble.setAttribute('data-' + (spawnTop - window.innerHeight), 'top:' + top + 'px;');
			var pos2 = bubble.setAttribute('data-' + spawnBottom, 'top:' + (top - 400 + (Math.random() * 300)) + 'px;');			

			spawn[i].appendChild(bubble);
		}
	}
}

var drawSlants = function() {
	var slants = document.getElementsByClassName('slants');

	for (i in slants) {
		if (slants[i].nodeName != 'CANVAS') {
			break;
		}
		var canvas = slants[i];
		canvas.width = document.getElementById('baseDividerImage').offsetWidth;
		canvas.height = document.getElementById('baseDividerImage').offsetHeight;
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Set up shadows
		ctx.shadowBlur = 100;
		ctx.shadowColor = "black";

		// Top triangle
		ctx.fillStyle = getColorByName(canvas.dataset.top);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(canvas.width, 0);
		if (canvas.dataset.align == 'left') {
			ctx.lineTo(0, (canvas.height / 6));
		}
		else {
			ctx.lineTo(canvas.width, (canvas.height / 6));
		}
		ctx.lineTo(0, 0);
		ctx.fill();

		// Bottom triangle
		ctx.fillStyle = getColorByName(canvas.dataset.bottom);
		ctx.beginPath();
		ctx.moveTo(0, canvas.height);
		ctx.lineTo(canvas.width, canvas.height);
		if (canvas.dataset.align == 'left') {
			ctx.lineTo(0, (canvas.height * 5 / 6));
		}
		else {
			ctx.lineTo(canvas.width, (canvas.height * 5 / 6));
		}
		ctx.lineTo(0, canvas.height);
		ctx.fill();

	}
}

var getColorByName = function(name) {
	switch(name){
		case 'blue':
			return '#2c3e50';
		case 'pink':
			return '#ff6666';
		case 'white':
			return '#ffffff';
		case 'yellow':
			return '#f5ae42';
		case 'gray':
			return '#444444';
		default:
			return null;
	}
}