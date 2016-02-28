if(debug) console.log('Loaded: js/structure');

Structure = function (x,y,width,height,img,movX,movY,movSpeed) {
	var self = {
		x: x,
		y: y,
		width: width,
		height: height,
		img: img,
		checkX: {
			'x':x,
			'dir':true
		},
		checkY: {
			'y':y,
			'dir':true
		},
		movX: (typeof movX === 'undefined') ? 0 : movX,
		movY: (typeof movX === 'undefined') ? 0 : movY,
		movSpeed:  (typeof movSpeed === 'undefined') ? 0 : movSpeed
	};

	self.update = function(){
		self.updatePosition();
		self.drawPattern();
	};

	self.updatePosition = function() {
		if (self.checkX.dir && self.movX > 0) {
			self.x = self.x + self.movSpeed;
			if (self.x - self.checkX.x >= self.movX) {
				self.checkX.dir = false;
			}
		} else if(self.movX > 0) {
			self.x = self.x - self.movSpeed;
			if (self.x - self.checkX.x <= -self.movX) {
				self.checkX.dir = true;
			}
		};
		if (self.checkY.dir && self.movY > 0) {
			self.y = self.y + self.movSpeed;
			if (self.y - self.checkY.y >= self.movY) {
				self.checkY.dir = false;
			}
		} else if(self.movY > 0) {
			self.y = self.y - self.movSpeed;
			if (self.y - self.checkY.y <= -self.movY) {
				self.checkY.dir = true;
			}
		};
	};

	self.draw = function() {
		ctx.drawImage(
			self.img,
			((self.x - player.x) + canvas.width/2),
			self.y,
			self.width,
			self.height
		)
	};

	self.drawPattern = function() {
		ctx.save();
		ctx.translate(((self.x - player.x) + canvas.width/2), self.y);
		ctx.fillStyle = ctx.createPattern(self.img, 'repeat');
	    ctx.fillRect(0, 0, self.width, self.height);
		ctx.restore();
	};

	return self;
}


Ground = function (x,y,width,height) {
	var self = Structure(x,y,width,height,imgLib.ground);

	return self;
}

Platform = function (x,y,width,height,movX,movY,movSpeed) {
	var self = Structure(x,y,width,height,imgLib.platform,movX,movY,movSpeed);

	return self;
}

Tower = function (x,y,width,height,movX,movY,movSpeed) {
	var self = Structure(x,y,width,height,imgLib.tower,movX,movY,movSpeed);

	return self;
}

EndCap = function () {
	var self			= Structure(-500,0,600,canvas.height,imgLib.tower,0,0,0);
		self.xoffset	= 0;
	var parent	= {
			'update': self.update
		};

	self.update = function(){
		if(self.x < player.x - canvas.width - self.width) {self.x = player.x - canvas.width - self.width;};
		parent.update();
	};

	return self;
}