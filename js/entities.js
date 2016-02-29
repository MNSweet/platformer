if(debug) console.log('Loaded: js/enities');
var upgradeList = [];
var player = {};
//////////////////////////////////////////////////////
//
// Entity Handling
//
//////////////////////////////////////////////////////
Entity = function(type,id,x,y,width,height,img){
	var self = {
		id:(typeof id == "undefined") ? Math.floor((Math.random() * 1000000) + 1) : id,
		type:type,
		x:x,
		y:y,
		width:width,
		height:height,
		img:img,
		colliding:false
	};

	self.update = function(){
		self.updatePosition();
		self.draw();
	}

	self.updatePosition = function(){};

	self.testCollision = {
		entity: function(entity2){ //return if colliding (true/false)
			var rect1 = {
				x:self.x-self.width/2,
				y:self.y-self.height/2,
				width:self.width,
				height:self.height
			};
			var rect2 = {
				x:entity2.x-entity2.width/2,
				y:entity2.y-entity2.height/2,
				width:entity2.width,
				height:entity2.height
			};
			return rect1.x <= rect2.x + rect2.width
				&& rect2.x <= rect1.x + rect1.width
				&& rect1.y <= rect2.y + rect2.height
				&& rect2.y <= rect1.y + rect1.height;
		},
		structure: function(structure){
			// get the vectors to check against
			var vX = self.x - (structure.x + (structure.width / 2)),
				vY = (self.y + (self.height / 2)) - (structure.y + (structure.height / 2)),
				// add the half widths and half heights of the objects
				halfWidths = (self.width / 2) + (structure.width / 2),
				halfHeights = (self.height / 2) + (structure.height / 2);
	 
			// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
			if (Math.abs(vX) < halfWidths && Math.abs(vY) < halfHeights) {// figures out on which side we are colliding (top, bottom, left, or right)				 
				var oX = halfWidths - Math.abs(vX),
					oY = halfHeights - Math.abs(vY);
				if (oX >= oY) {
					if (vY > 0) { //entity on bottom of structure
						self.y += oY;
						self.velY *= -1;
					} else {//entity on top of structure
						self.y -= oY;
						self.grounded = true;
						self.jumping = false;
						if (structure.checkX.dir && structure.movX > 0) {
							self.x = self.x + structure.movSpeed;
						} else if(structure.movX > 0) {
							self.x = self.x - structure.movSpeed;
						};
					};
				} else {
					self.velX = 0;
					self.jumping = false;
					if (vX > 0) {//entity to the right of structure
						self.x += oX;
					} else {//entity to the left of structure
						self.x -= oX;
					};
				};
			};
		}
	};

	self.draw = function(){
		ctx.save();

		var renderX = ((self.x - player.x) + canvas.width/2)  - self.width/2;
		var renderY = ((self.y - player.y) + canvas.height/2) - self.height/2;
			
		ctx.drawImage(
			self.img, //image
			0, //start crop x
			0, //start crop y
			self.img.width, //crop width
			self.img.height,//crop height
			renderX, //render x
			renderY,//render y
			self.width, //render width
			self.height //render height
		)
		ctx.restore();
	};

	return self;
};

AdvEntity = function(type,id,x,y,width,height,img,hp,atkSpd){
	var self 				= Entity(type,id,x,y,width,height,img);
		self.terminate		= false;
		self.spriteAnimate	= 0;
		self.directionMod	= 0;
	var parent = {
		update: self.update
	};

	self.update = function(){
		parent.update();
		self.spriteAnimate += 0.1;
		if(self.y > canvas.height + (self.height * 2)){
			self.onDeath();
		}
	}
	self.onDeath = function() {
	};
	self.draw = function(x,y){
		ctx.save();

		var frameWidth = self.img.width/4;
		var frameHeight = self.img.height/4;
		var walkingMod = Math.floor(self.spriteAnimate) % 4;

		ctx.drawImage(
			self.img, //image
			walkingMod * frameWidth, //start crop x 42
			self.directionMod * frameHeight, //start crop y 48
			self.img.width/4, //crop width
			self.img.height/4,//crop height
			((self.x - player.x) + canvas.width/2)  - self.width/2, //render x
			self.y,//render y
			self.width, //render width
			self.height //render height
		)
		ctx.restore();
	};
	return self;
}
 
Player = function(){
	// type,id,x,y,width,height,img,hp,atkSpd
	var self = AdvEntity(
			'player',
			'users',
			canvas.width/2,
			canvas.height-(imgLib.player.height/4)-10,
			imgLib.player.width/4,
			imgLib.player.height/4,
			imgLib.player,
			10,
			4
		);
		self.moveSpd =  4;
		self.velX = 0;
		self.velY = 0;
		self.jumping = false;
		self.grounded = false;
		self.reading = false;
	var parent = {
			update: self.update,
			onDeath: self.onDeath
		};

	self.update = function(){
		if(player.grounded){
			player.velY = 0;
		}
		parent.update();
	};
	self.onDeath = function(){
		self.x = canvas.width/2;
		self.y = canvas.height-(imgLib.player.height/4)-10;
		canvas.endCap.reset();
		console.log('Dead');
	};
	self.updatePosition = function() {
		if (keys[38] || keys[32] || keys[87]) { //Space || Up || W
			if (!self.jumping && self.grounded) {
				self.jumping = true;
				self.grounded = false;
				self.velY = -player.moveSpd * 2;
			};
		};
		if (keys[39] || keys[68]) {// right || D
			if (self.velX < self.moveSpd) {
				self.velX++;
				self.directionMod = 2;
			};
		};
		if (keys[37] || keys[65]) {// left || A
			if (self.velX > -self.moveSpd) {
				self.velX--;
				self.directionMod = 1;
			};
		};

		// Halt animation
		if (Math.round(self.velX) == 0) {
			self.spriteAnimate = 0;
			self.directionMod = 0;
		};
		if (self.jumping) {
			self.spriteAnimate = 1;
		};
		if (self.reading) {
			self.directionMod = 3;
		};

		// Death check
		if (self.terminate) {
			self.terminate = false;
		};

		self.velX 	*= canvas.friction;
		self.velY 	+= canvas.gravity;
		self.x 		+= self.velX;
		player.y 	+= player.velY;

	}

	return self;
}

Sign = function (id,message,x,size) {
	var self = Entity('Sign',id,x,canvas.height-46,32,36,imgLib.sign);
	
	self.notice = message;
	self.padding = 5;
	self.text = {
		padding: 5,
		border: 5,
		size: 20,
		font: 'Tahoma',
		width: 400
	};

	self.message = function() {
		ctx.save();

		ctx.font	= self.text.size + "px " + self.text.font;
		var offset	= 50;
		var text	= ctx.measureText(self.notice);
		var width	= text.width < self.text.width ? text.width : self.text.width;
		var realwidth = 0;

		var words	= self.notice.split(' ');
		var lines	= [];
		var line	= '';

		for(var n = 0; n < words.length; n++) {
			if(words[n] == '\n') {
				lines.push(line);
				n++;
				line = words[n] + ' ';
				continue;
			}

			var testLine	= line + words[n] + ' ';
			var metrics		= ctx.measureText(testLine.substring(0, testLine.length - 1));
			var testWidth	= metrics.width;
			if (testWidth > self.text.width && n > 0) {
				lines.push(line);
				line = words[n] + ' ';
			}
			else {
				realwidth = testWidth > realwidth ? testWidth : realwidth;
				line = testLine;
			}
		}
		lines.push(line);

		var renderX = (((self.x - player.x) + canvas.width/2) - self.width/2) - realwidth/2;

		ctx.fillStyle = "#b19775";
		ctx.fillRect(
			renderX - self.padding - self.text.border,
			offset - self.text.size - self.text.padding - self.text.border,
			realwidth + self.padding*2 + self.text.border*2,
			(self.text.size + 5) * lines.length + self.text.padding*2 + self.text.border*2
		);

		ctx.fillStyle = "#eae4dc";
		ctx.fillRect(
			renderX - self.padding,
			offset - self.text.size - self.padding,
			realwidth + self.padding*2,
			(self.text.size + 5) * lines.length + self.padding*2);

		ctx.fillStyle = "#000000";
		for(var n = 0; n < lines.length; n++) {
			ctx.fillText(lines[n],renderX,offset + (self.text.size + 5) * n);
		}
		ctx.restore();
	}

	self.update = function(){
		if(self.colliding && Math.abs(Math.round(player.velX)) < player.moveSpd - 0.5) {
			self.message();
			if(Math.abs(Math.round(player.velX)) < 0.5 && self.id != 'welcome') {
				player.reading = true;
			}
		}
		self.draw();
	}

	self.draw = function(){
		ctx.save();

		var renderX = ((self.x - player.x) + canvas.width/2) - self.width/2;
			
		ctx.drawImage(
			self.img, //image
			0, //start crop x
			0, //start crop y
			self.img.width, //crop width
			self.img.height,//crop height
			renderX, //render x
			self.y,//render y
			self.width, //render width
			self.height //render height
		)
		ctx.restore();
	};

	return self;
}

Enemy = function(id,x,y,width,height,img,hp,atkSpd){
	var self = AdvEntity('enemy',id,x,y,width,height,img,hp,atkSpd);
	var parent = {
			update: self.update,
			onDeath: self.onDeath,
			draw: self.draw
		};
	self.healthbar = {x:self.x,y:self.y}

	self.update = function(){
		parent.update();
		self.updateAim();
		if(self.terminate){
			delete enemyList[self.id];
		}
	};
	self.onDeath = function(){
		parent.onDeath();
		self.terminate = true;
	};
	self.updateAim = function() {
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;
		self.aimAngle = Math.atan2(diffY,diffX) / Math.PI * 180;
	};
	self.updatePosition = function() {
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;

		if (diffX > 0 && (diffX > 3 || diffX < -3)) {
			self.x += 3;
		} else if(diffX < 0 && (diffX < 3 || diffX > -3)) {
			self.x -= 3;
		};
		if (diffY > 0 && (diffY > 3 || diffY < -3)) {
			self.y += 3;
		} else if(diffY < 0 && (diffY < 3 || diffY > -3)) {
			self.y -= 3;
		};
	};
	self.draw = function() {
		parent.draw();
		/*var healthbar = {
			x: ((self.x - player.x) + WIDTH/2),
			y: ((self.y - player.y) + HEIGHT/2) - self.height - 20,
			width: self.width,
			height: 10,
			fill: self.width * self.hp / self.hpMax,
			fillColor: 'red'
		};*/
		if (self.healthbar.width < 0) {self.healthbar.width = 0};

		ctx.save();
		//bg
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.fillRect(self.healthbar.x - self.healthbar.width/2, self.healthbar.y, self.healthbar.width, self.healthbar.height);

		//fill
		ctx.fillStyle = self.healthbar.fillColor;
		ctx.fillRect(self.healthbar.x - self.healthbar.width/2, self.healthbar.y, self.healthbar.fill, self.healthbar.height);

		//stroke
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(self.healthbar.x - self.healthbar.width/2, self.healthbar.y, self.healthbar.width, self.healthbar.height);

		ctx.restore();


	}

	enemyList[id] = self;
}

Upgrade = function(id,x,y,width,height,category,img){
	var self = Entity('upgrade',id,x,y,width,height,img);
	self.category = category;

	var parent_update = self.update;

	self.update = function(){
		parent_update();
		   
		var isColliding = player.testCollision(self);
		if(isColliding){
			if(self.category == 'score') {
				score += 1000;
			}
			else if (self.category == 'atkSpd') {
				player.atkSpd += .5;
			}
			delete upgradeList[self.id];
		}
	}
	upgradeList[id] = self;
};