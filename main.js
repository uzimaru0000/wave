var canv, context;
var u, v, o;
var flag = false;
var mouseX = mouseY = 0;
var buffer;

window.onload = function() {
	canv = document.getElementById('canv');
	context = canv.getContext('2d');

	var bc = document.createElement('canvas');
	bc.width = canv.width;
	bc.height = canv.height;
	buffer = bc.getContext('2d');

	u = [];
	v = [];
	o = [];
	for(var x = 0; x < canv.width; x++) {
		u[x] = [];
		v[x] = [];
		o[x] = [];
		for(var y = 0; y < canv.height; y++) {
			u[x][y] = 0;
			v[x][y] = 0;
			o[x][y] = 0;
		}
	}

	createObject(50, 0, 5, 150);
	createObject(50, 160, 5, 160);
	createObject(75, 0, 5, 125);
	createObject(75, 135, 5, 40);
	createObject(75, 185, 5, 135);

	init();
	setInterval(init, 5);
	setInterval(function(){
		u[75][130] = -255;
		u[75][180] = -255;
	}, 500);
	setInterval(function(){
		if(flag) {
			u[mouseX][mouseY] = -255;
		}
	}, 50);

	canv.addEventListener("mousedown", function(e) {
		flag = true;
		mouseX = e.clientX;
		mouseY = e.clientY;
	});
	canv.addEventListener("mouseup", function(e) {
		flag = false;
	});
	canv.addEventListener("mousemove", function(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});
}

function init() {
	updateWave();

	var w = canv.width;
	var h = canv.height;

	var idata = context.getImageData(0, 0, w, h);
	for(var x = 0; x < w; x++) {
		for(var y = 0; y < h; y++) {
			var pix = (x + y * w) * 4;
			var value = u[x][y] * 50;
			idata.data[pix] = 0;
			idata.data[pix + 1] = 128;
			idata.data[pix + 2] = 255;
			idata.data[pix + 3] = value;
		}
	}
	context.putImageData(idata, 0, 0);
	context.drawImage(buffer.canvas, 0, 0);
}

function updateWave() {
	var w = canv.width;
	var h = canv.height;
	var ss = 0.3;
	var a = 0.99;
	var n = 1;

	for(var x = n; x < w-n; x++) {
		for(var y = n; y < h-n; y++) {
			var accel = u[x-n][y] +
						u[x+n][y] +
						u[x][y-n] +
						u[x][y+n] -
						u[x][y] * 4;
			accel *= ss;
			v[x][y] = (v[x][y] + accel) * a;
		}
	}

	for(var x = n; x < w-n; x++) {
		for(var y = n; y < h-n; y++) {
			if(o[x][y] == 1) {
				continue;
			}
			u[x][y] += v[x][y];
		}
	}

	for(var x = 0; x < w; x += w-1) {
		for(var y = 0; y < h; y += h-1) {
			var sum = 0;
			var count = 0;
			for(var i = -1; i < 2; i++) {
				for(var j = -1; j < 2; j++) {
					if(i == 0 || j == 0) continue;
					var dx = x + i;
					var dy = y + j;
					if(dx < 0 || dx >= w || dy < 0 || dy >= h) continue;
					sum += u[dx][dy];
					count++;
				}
			}
			sum /= count;
			u[x][y] = sum;
		}
	}
}

function createObject(x, y, w, h) {
	for(var i = 0; i < w; i++) {
		for(var j = 0; j < h; j++) {
			if(canv.width <= x + i || canv.height <= y + j) continue;
			o[x + i][y + j] = 1;
		}
	}
	buffer.fillRect(x, y, w, h);
}
