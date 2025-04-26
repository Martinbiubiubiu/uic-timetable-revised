var msgObj;
function showMessage(show_message_box, show_message_url, headImageType) {
	if(show_message_box!=null && show_message_box!=''){
		msgObj = new MessageObj(show_message_box, show_message_url, headImageType, true);
		msgObj.show();
		Drag.init(document.getElementById('message_head'), document.getElementById('message_show'));
	}else{
		msgObj = null;
	}
}

function loadingMessage(count, message, headImageType, isClose) {
	msgObj = new MessageObj(message, null, headImageType, isClose);
	msgObj.waiting(count);
	Drag.init(document.getElementById('message_head'), document.getElementById('message_show'));
}


var show_message_loading_image = new Array();
show_message_loading_image[0] = '/Skins/UIC/progress_bar/020204.gif';
show_message_loading_image[1] = '/Skins/UIC/progress_bar/030101.gif';
show_message_loading_image[2] = '/Skins/UIC/progress_bar/020302.gif';
show_message_loading_image[3] = '/Skins/UIC/progress_bar/020301.gif';

var show_message_Head_image = new Array();
show_message_Head_image['warn'] = '/Skins/UIC/icon/silk_icons/error.png';
show_message_Head_image['accept'] = '/Skins/UIC/icon/silk_icons/accept.png';
show_message_Head_image['info'] = '/Skins/UIC/icon/silk_icons/information.png';
show_message_Head_image['error'] = '/Skins/UIC/icon/silk_icons/exclamation.png';
show_message_Head_image['help'] = '/Skins/UIC/icon/silk_icons/help.png';
show_message_Head_image['star'] = '/Skins/UIC/icon/silk_icons/star.png';
show_message_Head_image['stop'] = '/Skins/UIC/icon/silk_icons/stop.png';
show_message_Head_image['new'] = '/Skins/UIC/icon/silk_icons/new.png';

function MessageObj(message, url, headImageType, isClose){
	this.message = (message==null||message=='') ? " Waiting…" : message;
	this.url = (url==null||url=='') ? null : url;
	this.isClose = (isClose==null) ? false : isClose;
	this.body = document.getElementById('body');
	this.msg = this.createDiv("message_show", "message_show");
	this.msgBg = this.createDiv("message_bg", "message_bg");
	this.msgMain = this.createDiv("message_main", "message_main");
	this.msgMainBody = this.createDiv("message_body", "message_body");
	this.msgMainHead = this.createDiv("message_head", "message_head");
	this.msgMainFoot = this.createDiv("message_foot", "message_foot");
	this.loading_image = show_message_loading_image;
	this.ctx = show_message_ctx;
	if(headImageType!=null&&headImageType!=''){
		this.headImage = this.ctx + show_message_Head_image[headImageType];
	}else{
		this.headImage = this.ctx + show_message_Head_image['warn'];
	}
	if(isClose){
		this.closeImg = this.createCloseImage();
		this.closeButton = this.createButton();
	}
}

MessageObj.prototype.show = function() {
	if (this.message!=null && this.message!='') {
		if(this.isClose){
			this.msgMainHead.appendChild(this.closeImg);
			this.msgMainFoot.appendChild(this.closeButton);
		}
		this.msgMainHead.appendChild(this.createImage(this.headImage, "head_type", ""));
		var span = document.createElement("span");
		span.className = "span";
		span.appendChild(this.createText());
		this.msgMainHead.appendChild(span);
		this.msgMainBody.appendChild(this.createText(this.message, true));
		this.msgMain.appendChild(this.msgMainHead);
		this.msgMain.appendChild(this.msgMainBody);
		this.msgMain.appendChild(this.msgMainFoot);
		this.msg.appendChild(this.msgBg);
		this.msg.appendChild(this.msgMain);
		this.body.parentNode.insertBefore(this.msg, this.body);
		msgObj.center();
	}
}



MessageObj.prototype.waiting = function (count) {
	var image = this.ctx;
	if(count==null||count<0||count>this.loading_image.length){
		image = image + this.loading_image[0];
	}else{
		image = image + this.loading_image[count];
	}
	this.msgMainBody.appendChild(this.createImage(image, "", ""));
	if(this.isClose){
		this.msgMainHead.appendChild(this.closeImg);
		this.msgMainFoot.appendChild(this.closeButton);
	}
	this.msgMainHead.appendChild(this.createImage(this.headImage, "head_type", ""));
	var span = document.createElement("span");
	span.className = "span";
	span.appendChild(this.createText());
	this.msgMainHead.appendChild(span);
	span = document.createElement("span");
	span.className = "span";
	span.appendChild(this.createText(this.message, true));
	this.msgMainBody.appendChild(span);
	this.msgMain.appendChild(this.msgMainHead);
	this.msgMain.appendChild(this.msgMainBody);
	this.msgMain.appendChild(this.msgMainFoot);
	this.msg.appendChild(this.msgBg);
	this.msg.appendChild(this.msgMain);
	this.body.parentNode.insertBefore(this.msg, this.body);
	msgObj.center();
}



MessageObj.prototype.createDiv = function (id, className) {
	var div = document.createElement("div");
	div.setAttribute("id", id);
	div.className = className;
	return div;
}


MessageObj.prototype.createImage = function (src, className, alt) {
	var img = document.createElement("img");
	img.setAttribute("src", src);
	img.className = className;
	img.setAttribute("alt", alt);
	return img;
}

MessageObj.prototype.createCloseImage = function() {
	var img = document.createElement("img");
	img.setAttribute("src", this.ctx + "/Skins/UIC/icon/mini_icons/login_close.gif");
	img.setAttribute("alt", "Close");
	img.className = "close";
	img.onclick = function() {
		if (msgObj.url == null) {
			msgObj.close();
		} else {
			location = msgObj.url;
		}
	};
	return img;
}

MessageObj.prototype.createButton = function() {
	var button = document.createElement("button");
	button.setAttribute("id", "show_message_colse_button");
	button.setAttribute("type", "button");
	button.onclick = function() {
		if (msgObj.url == null) {
			msgObj.close();
		} else {
			location = msgObj.url;
		}
	};
	button.appendChild(this.createText("OK"));
	return button;
}

MessageObj.prototype.close = function() {
	var massage_show = document.getElementById("message_show");
	if (massage_show != null) {
		massage_show.parentNode.removeChild(massage_show);
	}
}

MessageObj.prototype.createText= function(messageText, isHtml) {
	if (messageText == null) {
		messageText = "Message: ";
	}
	if(true == isHtml){
		var span = document.createElement('span');
		span.innerHTML = messageText;
		return span;
	}else{
		return document.createTextNode(messageText);
	}
}

MessageObj.prototype.full_show = function() {
	var msg = document.getElementById('message_show');
	msg.style.height = document.body.scrollHeight;
	msg.style.width = document.body.scrollWidth;
}

MessageObj.prototype.centerHeight = function() {
	var msgMain = document.getElementById('message_main');
	if(msgMain!=null){
		var msgMainBody = document.getElementById('message_body');
		var msgMainFoot = document.getElementById('message_foot');
		var msgMainBodyHeight = msgMainBody.offsetHeight;
		if (msgMainBodyHeight < 120) {
			var wrap = Math.round(((120 - msgMainBodyHeight) / 4));
			msgMainBody.style.marginTop = wrap + "px";
			if(msgMainFoot!=null){
				msgMainFoot.style.marginTop = (wrap * 3) + "px";
			}
		} else {
			msgMain.style.width = "500px";
			msgMain.style.height = (msgMainBody.offsetHeight + 88) + "px";
			if(msgMainFoot!=null){
				msgMainFoot.style.marginTop = "10px";
			}
		}
		var swrapHeight = document.body.scrollTop;
		if (swrapHeight == 0) {
			swrapHeight = document.documentElement.scrollTop;
		}
		if (swrapHeight == 0) {
			msgMain.style.top = "180px";
		} else {
			msgMain.style.top = (swrapHeight + 180) + "px";
		}
	}
}

MessageObj.prototype.centerWidth = function() {
	var msgMain = document.getElementById('message_main');
	if (msgMain != null) {
		var width = document.body.clientWidth;
		var position = Math.round((width - msgMain.offsetWidth)/2);
		msgMain.style.left = position + 'px';
	}
}

MessageObj.prototype.center = function(){
	this.full_show();
	this.centerHeight();
	this.centerWidth();
}

function show_message_fucus(){
	var button = document.getElementById('show_message_colse_button');
	if(button!=null){
		button.focus();
	}
}

addLoadEvent(show_message_fucus);