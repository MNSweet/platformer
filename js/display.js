if(debug) console.log('Loaded: js/display');

Background = function(){
	var	self = {
		groups:[]
	};
	
	self.draw = function(group) {
		if(typeof group == "undefined") {
			return;
		};
		for (var i = 0; i < self.groups[group].length; i++) {
			self.drawComponent(self.groups[group][i]);
		};
	};

	self.updateComponent = function(component) {
		if(component.playerBased){
			if(component.xoffset < -(component.width*2)) {component.x += component.width;};
			ctx.translate(component.xoffset, component.yoffset);
			component.xoffset = (((component.x - player.x) + canvas.width/2) - component.width/2) * component.xspeed;
		} else {
			if(component.xoffset < -component.width) {component.x = component.width/2;};
			ctx.translate(component.xoffset, component.yoffset);
			component.xoffset += component.xspeed;
		};
	};

	self.drawComponent = function(component) {
		ctx.save();
		self.updateComponent(component);
		if(component.pattern) {
			var ptrn		= ctx.createPattern(component.img, 'repeat'),
				tempWidth	= component.width,
				tempHeight	= component.height;
			ctx.fillStyle = ptrn;

			if (component.xspeed != 0) {tempWidth *= 3};
			if (component.yspeed != 0) {tempHeight *= 3};
			
			ctx.fillRect(
				0,
				0,
				tempWidth,
				tempHeight
			);
		} else {
			ctx.drawImage(
				component.img,
				component.sy,
				component.sx,
				component.swidth,
				component.sheight,
				component.x,
				component.y,
				component.width,
				component.height
			);
		};
			ctx.restore();
	};

	self.addComponent = function(group,pattern,imgSrc,x,y,width,height,sx,sy,swidth,sheight,xspeed,yspeed,playerBased) {
		if (!(group in self.groups)) {
			self.groups[group] = [];
		};

		var img 	= new Image();
			img.src = imgSrc;

		self.groups[group].push({
			'pattern':pattern,
			'img':img,
			'sx':sx,
			'sy':sy,
			'swidth':swidth,
			'sheight':sheight,
			'x':x,
			'y':y,
			'width':width,
			'height':height,
			'xspeed':xspeed,
			'yspeed':yspeed,
			'xoffset':x,
			'yoffset':y,
			'playerBased':playerBased
		});
	};

	return self;
}

// Background Sets
var bg = Background();

/// Main Game
bg.addComponent('main',true,'img/mountain.png',0,100,1000,400,0,0,0,0,.01,0,true);//furthest from player: Montains
bg.addComponent('main',true,'img/cloud-1.png',0,0,1500,200,0,0,0,0,-.4,0,false);
bg.addComponent('main',true,'img/hills.png',0,300,1000,100,0,0,0,0,.05,0,true);//Mid way to player: Hills
bg.addComponent('main',true,'img/bush.png',0,350,1000,50,0,0,0,0,1,0,true);//Closest to player: Bushes









