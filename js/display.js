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
		if(playerBased){
			//future player related movement: for parallax scrolling
		} else {
			//future auto play movement based on component.xspeed & component.yspeed
		}
	};

	self.drawComponent = function(component) {
		if(component.pattern) {
			ctx.save();
			var ptrn = ctx.createPattern(component.img, 'repeat');
			ctx.fillStyle = ptrn;
			ctx.fillRect(
				component.x,
				component.y,
				component.width,
				component.height
			);
			ctx.restore();
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
	};

	self.addComponent = function(group,pattern,imgSrc,x,y,width,height,sx,sy,swidth,sheight,xspeed,yspeed,playerBased) {
		if (!("key" in self.groups)) {
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
			'xoffset':0,
			'yoffset':0,
			'playerBased':playerBased
		});
	};

	return self;
}

// Background Sets
var bg = Background();

/// Main Game
bg.addComponent('main',true,'img/cloud-3.png',0,0,1000,200,0,0,0,0,.4,0,false);









