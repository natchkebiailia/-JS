/*!
 * µJS JavaScript Library v0.0.1
 * https://natchkebiailia.com/JS
 *
 * Copyright 2015, NATCHKEBIA Ilia
 * Released under the MIT license
 *
 * Date: 2015-06-25T15:09Z
 */
(function() {

var root = this;


var µ = function(selector) {
	var elements = [];
	// Handle: µ(""), µ(null), µ(undefined), µ(false)
	if ( !selector ) {
		return elements;
	}
	// Handle ID and className selectors
	if (typeof selector === "string") {
		selectors = selector.split(/[ ,]+/).unique();
		if( selectors.length > 1) {
			selectors.forEach(function(currentSelector) {
			    	elements=elements.concat(µ(currentSelector));
			});
		} else {
			selector=selectors[0];	
		}
		if (selector.firstChar().equals(".")) {
			var elsByClsNm = document.getElementsByClassName(selector.trimFront(1));
			if (!elsByClsNm.isEmpty())
				for(var i=0; i<elsByClsNm.length; i++)			
					elements=elements.concat(elsByClsNm[i]);
		}
		else if (selector.firstChar().equals("#")) {
			var elById = document.getElementById(selector.trimFront(1));
			if (!elById.isEmpty())			
				elements=elements.concat(elById);
		}
		// Handle tagName selectors like µ("document"), µ("head"), µ("body")
		else {
			var elsByTgNm = document.getElementsByTagName(selector);
			if (!elsByTgNm.isEmpty())
				for(var i=0; i<elsByTgNm.length; i++)			
					elements=elements.concat(elsByTgNm[i]);
		}
	}
	// Handle: µ(DOMElement)
	else if ( selector.nodeType ) {
		console.log(selector);
	}
	return 	elements.unique();
  };


if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports.µ = µ;
  } else {
    root.µ = µ;
  }

µ.VERSION = '0.0.1';















//DOM element prototype functions
HTMLElement.prototype.hasClass=function (className) {
	return new RegExp('(\\s|^)'+className+'(\\s|$)').test(this.className);
}
HTMLElement.prototype.addClass=function (className) {
	if (!this.hasClass(className))
		return (this.className += " "+className) ? true:false;
	return false;
}
HTMLElement.prototype.removeClass=function (className) {
	if (this.hasClass(className))
        	return (this.className=this.className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'')) ? true:true; //because of bool("")=false
	return false;
}
//Object prototypes
Object.prototype.type = function(){
   var retVal = (/function (.{1,})\(/).exec((this).constructor.toString());
   return (retVal && retVal.length > 1) ? retVal[1] : "undefined";
}
Object.prototype.isEmpty = function (){
	if(this.type().equals("Object"))
		return (Object.getOwnPropertyNames(this).length === 0);
	return (this.toString().length > 0) ? false:true;
}
//String prototypes
String.prototype.firstChar = function(){
	return this.charAt(0);
}
String.prototype.trimFront = function(n){
	(n < this.length) ? n:this.length-1
	return this.substring(n);
}
String.prototype.trimEnd = function(n){
	(n < this.length) ?  n:this.length-1;
	return this.substring(0,this.length-n);
}
String.prototype.equals = Number.prototype.equals =function(value){
	value = value || "";
	if(this.toString() == value.toString())
		return true;
	return false;
}
String.prototype.toDec=Number.prototype.toDec = function(){
	if (isNaN(this))
		return this.romanToDec();
	else if(this.match(/^[0-1]+$/)!= null)
		return parseInt(this, 2);
	return parseInt(this,10)
}
String.prototype.base=Number.prototype.base = function(n){
	n = n || 2;
	return this.toString(n);
}
String.prototype.toRoman=Number.prototype.toRoman = function(){
	var roman="";
	var number=parseInt(this,10);
	if (0 >= number || number > 3888)
		return roman;
	var numbers=[{num:1000,rom:"M"},{num:900,rom:"CM"},{num:500,rom:"D"},{num:400,rom:"CD"},{num:100,rom:"C"},{num:90,rom:"XC"},{num:50,rom:"L"},{num:40,rom:"XL"},{num:10,rom:"X"},{num:9,rom:"IX"},{num:5,rom:"V"},{num:4,rom:"IV"},{num:1,rom:"I"}];

	while(number){
		for(var i=0;i<numbers.length;i++)
			if(numbers[i].num<=number){
				number-=numbers[i].num;
				roman+=numbers[i].rom;
				break;
			}
	}
	return roman;
}
String.prototype.romanToDec=Number.prototype.romanToDec = function(){
	var n={"M":1000,"D":500,"C":100,"L":50,"X":10,"V":5,"I":1};
	var ans=0;
	var str=this.toUpperCase();
	if(str.match(/^[C,D,I,L,M,V,X]+$/) == null)
		return Number.NaN
	ans+=n[str[str.length-1]];
	for(var i=str.length-2;i>=0;i--)
		if(n[str[i]]>=n[str[i+1]])
			ans+=n[str[i]];
		else
			ans-=n[str[i]];
	if (ans.toRoman().toString() == this.toString().toUpperCase())
		return ans;
	return Number.NaN
}
//Math object extension, radian/degree conversations
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

//Array prototypes
Array.prototype.unique = function() {
    var a = [];
    for (var i=0, l=this.length; i<l; i++)
        if (a.indexOf(this[i]) === -1)
            a.push(this[i]);
    return a;
}
Array.prototype.first = function() {
	return this[0];
}
//HTMLElements
HTMLElement.prototype.show = function(ms) {
	this.style.opacity = 1;
	this.style.display = "";
	return this;
}
HTMLElement.prototype.hide = function(ms) {
	//there is a bug while hide and show again, timer does not stop, but I don't need that right now 
	var that = this;
	ms = (ms !== undefined) ? ms : 777;
	this.style.opacity = 0;
	µ.delay(function(){
		that.style.display = "none";
	},ms);
	return this;
}
HTMLElement.prototype.canDrag = function() {
	this.ondragstart = function() { return false; };
	this.onmousedown=function(event){
		µ.draggable.startDragging(this,event);
	  }
	document.body.onmouseup=function() {
		µ.draggable.stopDragging();
	}
	return this;
}

µ.draggable = function(){
                return {
                    moves : function(ele,xpos,ypos){
                        ele.style.left = xpos + 'px';
                        ele.style.top = ypos + 'px';
                    },
                    startDragging : function(ele,evt){
                        evt = evt || window.event;
                        var posX = evt.clientX,
                            posY = evt.clientY,
                        divTop = ele.style.top,
                        divLeft = ele.style.left,
                        eWi = parseInt(ele.style.width),
                        eHe = parseInt(ele.style.height),
                        divTop = divTop.replace('px','');
                        divLeft = divLeft.replace('px','');
                        var diffX = posX - divLeft,
                            diffY = posY - divTop;
                        document.onmousemove = function(evt){
                            evt = evt || window.event;
                            var posX = evt.clientX,
                                posY = evt.clientY,
                                aX = posX - diffX,
                                aY = posY - diffY;
                                if (aX < 0) aX = 0;
                                if (aY < 0) aY = 0;
                            µ.draggable.moves(ele,aX,aY);
                        }
                    },
                    stopDragging : function(){
                        document.onmousemove = function(){}
                    },
                }
}();

µ.delay = function(evt,ms){
	return window.setTimeout(evt,ms);
}
}.call(this))
