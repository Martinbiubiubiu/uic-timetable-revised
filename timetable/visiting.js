function visitingBgChange() {
	if (!document.getElementById)
		return;
	var menu = document.getElementById('topmenu');
	if (menu != null) {
		var lis = menu.getElementsByTagName("li");
		var str_url = window.location.href;
		var current_url = str_url.substr(0, str_url.lastIndexOf('.do')) + '.do';
		var ifFind = false;
		for ( var i = 0; i < lis.length; i++) {
			var a = lis[i].getElementsByTagName('a');
			if (a.length > 0) {
				var d = a[0].getAttribute('href');
				if (current_url.indexOf(d) != -1) {
					lis[i].className = 'highlight';
					ifFind = true;
					break;
				}
			}
		}
		var isHightlight = 0;
		var isF = '';
		if (!ifFind) {
			for (var i = 0; i < lis.length; i++) {
				var a = lis[i].getElementsByTagName('a');
				var ahref = a[0].getAttribute('href');
				var f = ahref.substring(0, ahref.lastIndexOf('/'));
				if (current_url.indexOf(f) != -1&& ahref.indexOf('#') == -1) {
					if(isF.length<f.length){
						isHightlight = i;
						isF = f;
						ifFind = true;
					}
				}
			}
			if(ifFind){
				lis[isHightlight].className = 'highlight';
			}
		}
	}
}

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

addLoadEvent(visitingBgChange);