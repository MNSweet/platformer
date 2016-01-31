if(debug) console.log('Loaded: js/structure');

Structure = function (x,y,width,height,movX,movY) {
	var self = {
		x: x,
		y: y,
		width: width,
		height: height,
		movX: movX,
		movY: movY
	}

	self.update = function(){
		self.updatePosition();
		self.draw();
		self.testCollision(player);
	}

	self.updatePosition = function() {};

	self.draw = function(){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.beginPath(); 
		ctx.fillRect(self.x, self.y, self.width, self.height);
		ctx.restore();
	}

//move to player class
	self.testCollision = function(entity){ //return colliding: (t)op, (b)ottom, (l)eft, (r)ight, (null)
		// get the vectors to check against
		var vX = (entity.x + (entity.width / 2)) - (self.x + (self.width / 2)),
			vY = (entity.y + (entity.height / 2)) - (self.y + (self.height / 2)),
			// add the half widths and half heights of the objects
			halfWidths = (entity.width / 2) + (self.width / 2),
			halfHeights = (entity.height / 2) + (self.height / 2),
			colDir = null;
 
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
		return colDir;
	}

	return self;
}