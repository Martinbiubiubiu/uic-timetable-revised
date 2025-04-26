var cp_ldap_obj;

function cp_ldap(uid) {
	if (cp_ldap_obj == null) {
		cp_ldap_obj = new Cp_LDAP_Obj(uid);
		
	}
	cp_ldap_obj.create();
	
};
var cp_tips = new Array();
cp_tips['password'] = 'The password should be 8-16 character strings with uppercase character, lowercase character, number (0-9) and/or symbol.';
 Cp_LDAP_Obj = function (uid) {
	this.uid = uid;
	this.to = null;
	this.to_stop = false;
	this.message = null;
	this.rg = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9\W_]{8,16}$/;
	this.check = function() {
		this.message = '';
		document.getElementById('cp_su').setAttribute("disabled", "disabled");
		document.getElementById('cp_ca').setAttribute("disabled", "disabled");
		var uid = document.getElementById('uid').value;
		var oldPassword = document.getElementById('oldPassword').value;
		var newPassword = document.getElementById('newPassword').value;
		var cPassword = document.getElementById('cPassword').value;
		if (uid.length==0) {
			this.message = this.message + 'Login ID incorrect! <br />';
		}
		if (oldPassword.length==0) {
			this.message = this.message + 'Incorrect Old Password! <br />';
		}
		if (!this.validate(newPassword)) {
			this.message = this.message + 'Incorrect New Password! <br />';
		}
		if (cPassword != newPassword) {
			this.message = this.message
					+ "New Password and Confirm Password doesn't match! <br />";
		}
		if (this.message.length > 0) {
			cp_ldap_obj.to_stop = true;
			this.createMessage(false);
		} else {
			var request = YAHOO.util.Get.script("/base/user/changePassword.do?uid="
							+ uid
							+ "&oldPassword="
							+ oldPassword
							+ "&newPassword=" + newPassword,
                    { onSuccess: this.handleJsSuccess, 
                      onFailure: this.handleFailure
                    });
			
//			jQuery.getScript("http://mis.uic.edu.hk/base/portal/changPassword.do?"+"uid="+ uid+ "&oldPassword="+ oldPassword + "&newPassword=" + newPassword,
//					function(){
//						cp_ldap_obj.to_stop = true;
//						if(data!=null&&data[0].mess=='1'){
//								cp_ldap_obj.message = 'Change Password successfully!!';
//								cp_ldap_obj.createMessage(true);
//								}else{
//									cp_ldap_obj.message = 'Change Password failure!!';
//									cp_ldap_obj.createMessage(false);
//								}
//						
//					}
//			);
		}
	};
	
	
	this.handleJsSuccess =function(o){
		cp_ldap_obj.to_stop = true;
		if(data[0].mess=='1'){
		cp_ldap_obj.message = 'Change Password successfully!!';
		cp_ldap_obj.createMessage(true);
		}else{
			cp_ldap_obj.message = 'Change Password failure!!';
			cp_ldap_obj.createMessage(false);
		}
	};
	this.handleFailure = function(o){
		cp_ldap_obj.to_stop = true;
		cp_ldap_obj.message = 'Change Password failure!!';
		cp_ldap_obj.createMessage(false);
    };
	this.handleTimeout = function(o){
		if(!cp_ldap_obj.to_stop){
			cp_ldap_obj.to_stop = true;
			cp_ldap_obj.message = 'The network was busy, please try again later!!!';
			cp_ldap_obj.createMessage(true);
		}
    };
	this.clear = function(){
		this.handleTimeout();
	};
	this.validate = function(text) {
		return this.rg.test(text);
	};
	this.validate = function(text) {
		return text.length > 0 && this.rg.test(text);
	};

	this.createMessage = function(isSucceed) {
		var body = document.getElementsByTagName('body');
		if (body.length == 1) {
			this.close();
			var cp_main = this.createDiv("cp_main");
			cp_main.appendChild(this.createDiv("cp_bg"));
			var cp_content = this.createDiv("cp_content");
			var div = this.createDiv();
			var form = document.createElement("form");
			form.appendChild(this.createMessageDiv('cpm_head', "Message："));
			form.appendChild(this.createMessageDivBody('cpm_body', this.message));
			form.appendChild(this.createMessageDivFoot('cpm_foot', isSucceed));
			div.appendChild(form);
			cp_content.appendChild(div);
			cp_main.appendChild(cp_content);
			body[0].appendChild(cp_main);
			this.center();
			document.getElementById('cp_ok').focus();
			if(Drag!=null){
				Drag.init(document.getElementById('cp_caption'), document.getElementById('cp_main'));
			}
		}
	};
	
	this.checkPassword = function (){
		var newPassword = document.getElementById('newPassword');
		if(newPassword!=null){
			var value = newPassword.value;
			this.removeSbling(newPassword);
			if(value.length>0){
				if(this.validate(value)){
					newPassword.style.background = '';
				}else{
					var message;
					if(value.length<8){
						message = "Too short!";
					}else if(value.length>16){
						message = "Too long!";
					}else {
						message = "The password should be 8-16 character strings with uppercase character, lowercase character, number (0-9) and/or symbol!";
					}
					newPassword.style.background = '#F00';
					this.appedSbling(newPassword, message);
				}
			}else{
				newPassword.style.background = '';
			}
		}
	};
	
	this.checkCPassword = function (){
		var newPassword = document.getElementById('newPassword');
		var cPassword = document.getElementById('cPassword');
		this.removeSbling(cPassword);
		if(cPassword.value.length>0){
			if(newPassword.value!=cPassword.value){
				message = "New Password and Confirm Password doesn't match!";
				cPassword.style.background = '#F00';
				this.appedSbling(cPassword, message);
			}
		}else{
			cPassword.style.background = '';
		}
	};
	
	this.appedSbling = function(par, message){
		var parentNode = par.parentNode;
		parentNode.appendChild(document.createElement("br"));
		parentNode.appendChild(this.createTips(message));
	};
	
	this.removeSbling = function (par){
		var parentNode = par.parentNode;
		while(parentNode.childNodes.length>1){
			par.parentNode.removeChild(parentNode.lastChild);
		}
	};
	
	this.createMessageDivBody = function(id, message) {
		var div = document.createElement("div");
		div.setAttribute("id", id);
		div.innerHTML = message;
		return div;
	};
	
	this.createMessageDiv = function(id, message) {
		var div = document.createElement("div");
		if (id != null) {
			div.setAttribute("id", id);
		}
		var span = document.createElement('span');
		span.innerHTML = message;
		div.appendChild(span);
		return div;
	};

	this.createMessageDivFoot = function(id, isSucceed) {
		var div = document.createElement("div");
		div.setAttribute("id", id);
		var button = document.createElement("button");
		button.setAttribute("type", "submit");
		button.setAttribute("id", "cp_ok");
		if (isSucceed) {
			button.onclick = function() {
				cp_ldap_obj.close();
			};
		} else {
			button.onclick = function() {
				cp_ldap_obj.close();
				cp_ldap_obj.create();
			};
		}
		button.appendChild(document.createTextNode("OK"));
		div.appendChild(button);
		return div;
	};

	this.create = function() {
		var body = document.getElementsByTagName('body');
		if (body.length == 1) {
			this.close();
			var cp_main = this.createDiv("cp_main");
			cp_main.appendChild(this.createDiv("cp_bg"));
			var cp_content = this.createDiv("cp_content");
			var div = this.createDiv();
			var form = document.createElement("form");
			form.appendChild(this.createTable());
			div.appendChild(form);
			cp_content.appendChild(div);
			cp_main.appendChild(cp_content);
			body[0].appendChild(cp_main);
			this.center();
			document.getElementById('uid').focus();
			Drag.init(document.getElementById('cp_caption'), document.getElementById('cp_main'));
		}
		
	};
	this.createDiv = function(id) {
		var div = document.createElement("div");
		if (id != null) {
			div.setAttribute("id", id);
		}
		return div;
	};
	this.createTable = function() {
		var tr;
		var table = document.createElement("table");
		var caption = document.createElement("caption");
		caption.setAttribute("id", "cp_caption")
		caption.appendChild(document.createTextNode('Change Password:'));
		table.appendChild(caption);
		tr = table.insertRow(-1);
		this.createTh(tr, "Login ID：");
		this.createTd(tr, this.createInput("text", "uid", this.uid));
		tr = table.insertRow(-1);
		this.createTh(tr, "Old Password：");
		this.createTd(tr, this.createInput("password", "oldPassword"));
		tr = table.insertRow(-1);
		this.createTh(tr, "New Password：");
		this.createTd(tr, this.createInput("password", "newPassword"), false);
		this.createTdTips(tr, 'The password should be 8-16 character strings with uppercase character, lowercase character, number (0-9) and/or symbol.', "2");
		tr = table.insertRow(-1);
		this.createTh(tr, "Confirm Password：");
		this.createTd(tr, this.createInput("password", "cPassword"),false);
		tr = table.insertRow(-1);
		this.createTdAction(tr);
		return table;
	};
	this.createTh = function(tr, message) {
		var th = tr.insertCell(-1);
		th.className = 'th';
		th.appendChild(document.createTextNode(message));
		return th;
	};
	this.createTd = function(tr, input, isColspan) {
		var td = tr.insertCell(-1);
		td.appendChild(input);
		if(false != isColspan){
			td.setAttribute("colspan", "2", 0);
		}
		return td;
	};
	this.createTdTips = function(tr, message, row) {
		var td = tr.insertCell(-1);
		if(row!=null){
			td.setAttribute("rowSpan", "2");
		}
		td.appendChild(this.createTips(message));
		return td;
	};
	this.createTdAction = function(tr) {
		var tdAction = tr.insertCell(-1);
		tdAction.setAttribute("colspan", "3", 0);
		tdAction.className = 'action';
		tdAction.appendChild(this.createButton(true));
		tdAction.appendChild(this.createButton(false));
		return tdAction;
	};
	

	this.createTips = function(tips) {
		var span = document.createElement("span");
		span.className = "tips";
		span.appendChild(document.createTextNode(tips));
		return span;
	};
	
	this.createInput = function(type, name, value) {
		var input = document.createElement("input");
		input.setAttribute("type", type);
		input.setAttribute("name", name);
		input.setAttribute("id", name);
		if(value!=null){
			input.setAttribute("value", value);
		}
		if(name=='uid'){
			input.onblur = function (){
				cp_ldap_obj.checknull();
			}}
			if(name=='oldPassword'){
			input.onblur = function (){
				cp_ldap_obj.checknull();
			}}
		if(name=='newPassword'){
			input.onblur = function (){
				cp_ldap_obj.checkPassword();
				cp_ldap_obj.checknull();
			}
		}else if(name=='cPassword'){
			input.onblur = function (){
				cp_ldap_obj.checkCPassword();
				cp_ldap_obj.checknull();
			}
		}
		return input;
	};
	this.createButton = function(isSubmit) {
		var button = document.createElement("button");
		if (isSubmit) {
			button.setAttribute("type", "submit");
			button.onclick = function() {
				cp_ldap_obj.to_stop = false;
				cp_ldap_obj.check();
				cp_ldap_obj.to = setTimeout('cp_ldap_obj.clear()', 6000);
				return false;
			};
			button.setAttribute("id", "cp_su");
			button.setAttribute("disabled", "disabled");
			button.appendChild(document.createTextNode("Submit"));
		} else {
			button.setAttribute("type", "button");
			button.onclick = function() {
				cp_ldap_obj.close();
			};
			button.setAttribute("id", "cp_ca");
			button.appendChild(document.createTextNode("Cancel"));
		}
		return button;
	};
	this.close = function() {
		var cp_ldap = document.getElementById("cp_main");
		if (cp_ldap != null) {
			cp_ldap.parentNode.removeChild(cp_ldap);
		}
	};
	this.centerHeight = function() {
		var cp_main = document.getElementById('cp_main');
		if (cp_main != null) {
			var cp_content = document.getElementById('cp_content');
			var swrapHeight = document.body.scrollTop;
			if (swrapHeight == 0) {
				swrapHeight = document.documentElement.scrollTop;
			}
			if (swrapHeight == 0) {
				cp_content.style.top = "250px";
			} else {
				cp_content.style.top = (swrapHeight + 200) + "px";
			}
		}
	};
	this.centerWidth = function() {
		var cp_content = document.getElementById('cp_content');
		if (cp_content != null) {
			var width = document.body.clientWidth;
			var position = Math.round((width - cp_content.offsetWidth) / 2);
			cp_content.style.left = position + 'px';
		}
	};
	this.center = function() {
		this.full_show();
		this.centerHeight();
		this.centerWidth();
	};
	this.full_show = function() {
		var cp_main = document.getElementById('cp_main');
		cp_main.style.height = document.body.scrollHeight;
		cp_main.style.width = document.body.scrollWidth;
	};
	this.checknull = function() {
				var uid1 = document.getElementById('uid').value;
		var oldPassword1 = document.getElementById('oldPassword').value;
		var newPassword1 = document.getElementById('newPassword').value;
		var cPassword1 = document.getElementById('cPassword').value;
		if (uid1.length>0&&oldPassword1.length>0&&cPassword1==newPassword1&&newPassword1!=0) {
			document.getElementById('cp_su').removeAttribute("disabled");
		}
		else{
document.getElementById('cp_su').setAttribute("disabled", "disabled");
			}
	};
}