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
		movX: movX,
		movY: movY,
		movSpeed: movSpeed
	};

	self.update = function(){};

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
			self.x,
			self.y,
			self.width,
			self.height
		)
	};

	self.drawPattern = function() {
		ctx.save();
		ctx.translate(self.x, self.y);
		ctx.fillStyle = ctx.createPattern(self.img, 'repeat');
	    ctx.fillRect(0, 0, self.width, self.height);
		ctx.restore();
	};

	return self;
}


Ground = function (x,y,width,height) {
	var self = Structure(x,y,width,height,imgLib.ground);

	self.update = function(){
		self.drawPattern();
	};

	return self;
}

Platform = function (x,y,width,height,movX,movY,movSpeed) {
	var self = Structure(x,y,width,height,imgLib.platform,movX,movY,movSpeed);

	self.update = function() {
		self.updatePosition();
		self.drawPattern();
	};

	return self;
}