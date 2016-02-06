if(debug) console.log('Loaded: js/enities');
var upgradeList = [];
var player = {};
var imgLib = {};
	imgLib.player		= new Image();
	imgLib.player.src	= "img/player.png";
//////////////////////////////////////////////////////
//
// Entity Handling
//
//////////////////////////////////////////////////////
Entity = function(type,id,x,y,width,height,img){
	var self = {
		id:id,
		type:type,
		x:x,
		y:y,
		width:width,
		height:height,
		img:img
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
			var vX = (self.x + (self.width / 2)) - (structure.x + (structure.width / 2)),
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
					if (vX > 0) {//entity to the left of structure
						self.x += oX;
					} else {//entity to the right of structure
						self.x -= oX;
					};
				};
			};
		}
	};

	self.draw = function(){
		ctx.save();

		var renderX = ((self.x - player.x) + WIDTH/2)  - self.width/2;
		var renderY = ((self.y - player.y) + HEIGHT/2) - self.height/2;

		if(player.mapEdge.left ){ 
			renderX = self.x-self.width/2; };
		if(player.mapEdge.top){ 
			renderY = self.y-self.height/2; };

		if(player.mapEdge.right){ 
			renderX = self.x-self.width/2 + WIDTH - currentMap.image.width*2;
			 };
		if(player.mapEdge.bottom ){ 
			renderY = self.y-self.height/2 + HEIGHT - currentMap.image.height*2; };
			
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
	    self.hp 			= hp;
	    self.hpMax 			= hp;
		self.terminate		= false;
		self.spriteAnimate	= 0;
		self.directionMod	= 0;
		self.healthbar 		= {
			x: self.x,//((self.x - player.x) + WIDTH/2),
			y: self.y,//((self.y - player.y) + HEIGHT/2) - self.height - 20,
			width: self.width,
			height: 10,
			fill: self.width * self.hp / self.hpMax,
			fillColor: 'red'
		};
    var parent = {
    	update: self.update
    };

    self.update = function(){
    	parent.update();
    	self.spriteAnimate += 0.1;
		if(self.hp <= 0){
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
		var renderX = self.x;
		var renderY = self.y;
/*		var renderX = ((self.x - player.x) + width/2)  - self.width/2;
		var renderY = ((self.y - player.y) + height/2) - self.height/2;

		if(player.mapEdge.left ){ 
			renderX = self.x-self.width/2; };
		if(player.mapEdge.top){ 
			renderY = self.y-self.height/2; };

		if(player.mapEdge.right){ 
			renderX = self.x-self.width/2 + width - currentMap.image.width*2;
		};
		if(player.mapEdge.bottom ){ 
			renderY = self.y-self.height/2 + height - currentMap.image.height*2;
		};*/

		ctx.drawImage(
			self.img, //image
			walkingMod * frameWidth, //start crop x 42
			self.directionMod * frameHeight, //start crop y 48
			self.img.width/4, //crop width
			self.img.height/4,//crop height
			renderX, //render x
			renderY,//render y
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
			width/2,
			height-(imgLib.player.height/4)-10,
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
		self.mapEdge = {
			top:false,
			bottom:false,
			left:false,
			right:false
		};
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
    	parent.onDeath();
		var timeSurvived = Date.now() - timeWhenGameStarted;
		console.log("You lost! You survived for " + timeSurvived/1000 + " sec's. Score: " + score);
		Init();
    };
	self.updatePosition = function() {
		if (keys[38] || keys[32] || keys[87]) { //Space || Up || W
			if (!self.jumping && self.grounded) {
				self.jumping = true;
				self.grounded = false;
				self.velY = -player.moveSpd * 2;
			}
		}
		if (keys[39] || keys[68]) {// right || D
			if (self.velX < self.moveSpd) {
				self.velX++;
				self.directionMod = 2;
			}
		}
		if (keys[37] || keys[65]) {// left || A
			if (self.velX > -self.moveSpd) {
				self.velX--;
				self.directionMod = 1;
			}
		}

    	// Halt animation
		if (Math.round(self.velX) == 0) {
			self.spriteAnimate = 0;
			self.directionMod = 0;
		};
		if (self.jumping) {
			self.spriteAnimate = 1;
		};


		// Death check
		if (self.terminate) {
			self.terminate = false;
		};


	    self.velX 	*= friction;
    	self.velY 	+= gravity;
		self.x 		+= self.velX;
		player.y 	+= player.velY;


		/*if(self.pressingRight)
			self.x += self.moveSpd;
		if(self.pressingLeft)
			self.x -= self.moveSpd;  
		if(self.pressingDown)
			self.y += self.moveSpd;  
		if(self.pressingUp)
			self.y -= self.moveSpd;  

		//ispositionvalid
		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > currentMap.width - self.width/2)
			self.x = currentMap.width - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > currentMap.height - self.height/2)
			self.y = currentMap.height - self.height/2;

		player.mapEdge.top 		= false;
		player.mapEdge.bottom 	= false;
		player.mapEdge.left 	= false;
		player.mapEdge.right 	= false;
		if (width/2 - player.x > 0) {
			player.mapEdge.left = true;
		};
		if (width/2 - currentMap.image.width*2 + player.x > 0 ) {
			player.mapEdge.right = true;
		};
		if (height/2 - player.y > 0) {
			player.mapEdge.top = true;
		}
		if (height/2 - currentMap.image.height*2 + player.y > 0) {
			player.mapEdge.bottom = true;

		}*/
	}

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