if(debug) console.log('Loaded: js/structure');

Structure = function (x,y,width,height,img) {
	var self = {
		x: x,
		y: y,
		width: width,
		height: height,
		img: img
	}

	self.update = function(){
		self.testCollision(player);
	}

	self.updatePosition = function() {};

	self.draw = function() {
		ctx.drawImage(
			self.img,
			self.x,
			self.y,
			self.width,
			self.height
		)
	}

	self.drawPattern = function() {
		ctx.save();
		ctx.translate(self.x, self.y);
		ctx.fillStyle = ctx.createPattern(self.img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
	    ctx.fillRect(0, 0, self.width, self.height); // context.fillRect(x, y, width, height);
		ctx.restore();
	}

//move to player class
	self.testCollision = function(entity){
		// get the vectors to check against
		var vX = (entity.x + (entity.width / 2)) - (self.x + (self.width / 2)),
			vY = (entity.y + (entity.height / 2)) - (self.y + (self.height / 2)),
			// add the half widths and half heights of the objects
			halfWidths = (entity.width / 2) + (self.width / 2),
			halfHeights = (entity.height / 2) + (self.height / 2);
 
		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(vX) < halfWidths && Math.abs(vY) < halfHeights) {// figures out on which side we are colliding (top, bottom, left, or right)				 
			var oX = halfWidths - Math.abs(vX),
				oY = halfHeights - Math.abs(vY);
			if (oX >= oY) {
				if (vY > 0) { //entity on bottom of block
					entity.y += oY;
					player.velY *= -1;
				} else {//entity on top of block
					entity.y -= oY;
					entity.grounded = true;
					entity.jumping = false;
				}
			} else {
				entity.velX = 0;
				entity.jumping = false;
				if (vX > 0) {//entity to the left of block
					entity.x += oX;
				} else {//entity to the right of block
					entity.x -= oX;
				}
			}
		}
	}

	return self;
}


MovingStructure = function (x,y,width,height,img,movX,movY,movSpeed) {
	var self = Structure(x,y,width,height,img);
		self.checkX 	= {'x':x,'dir':true};
		self.checkY 	= {'y':y,'dir':true};
		self.movX 		= movX;
		self.movY 		= movY;
		self.movSpeed	= movSpeed;
    var parent = {
    		update: self.update
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
	self.update = function() {
		self.updatePosition();
		self.drawPattern();
		parent.update();
	}
	return self;
}


Ground = function (x,y,width,height) {
	var self = Structure(x,y,width,height,imgLib.ground);
    var parent = {
    		update: self.update
    	};

	self.update = function(){
		self.drawPattern();
		parent.update();
	}
	return self;
}

Platform = function (x,y,width,height,movX,movY,movSpeed) {
	var self = MovingStructure(x,y,width,height,imgLib.platform,movX,movY,movSpeed);
	return self;
}