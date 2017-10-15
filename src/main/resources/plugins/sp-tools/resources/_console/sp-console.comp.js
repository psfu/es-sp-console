/**
 * auther psfu
 * 
 * 
 * 
 */

helpText = "<p style='color:yellow;'>"
		+ "------------------------------------------------------------<br/>"
		+ "-&nbsp; The sp console is authored by psfu<br/>"
		+ "-&nbsp; Directly input the cat command &nbsp;&nbsp;&nbsp; <b>EX:&nbsp; <u>nodes</u></b><br/>"
		+ "-&nbsp; Input &nbsp; <b><u>help</u></b> &nbsp; for  _cat's help<br/>"
		+ "-&nbsp; If using sp-tools, Input <b><u>sp/help</u></b> for help<br/>"
		+ "------------------------------------------------------------<br/>"
		+ "</p><br/>";

function clearShow() {
	console.info('clear');
	showDiv.children("p").each(function(idx, e) {
		console.info(e);
		e.remove();
	});
	showDiv.children("br").each(function(idx, e) {
		console.info(e);
		e.remove();
	});

	showDiv.append(helpText);

}
fontSize = 100;
function upFont() {
	if (fontSize <= 140) {
		fontSize += 10;
		showDiv.css("font-size", fontSize + "%");
	}
}
function downFont() {
	if (fontSize >= 30) {
		fontSize -= 10;
		showDiv.css("font-size", fontSize + "%");
	}
}
function scrollLockChange() {
	if (scrollLock) {
		scrollLock = false;
	} else {
		scrollLock = true;
	}
}
function inputChange(input) {

}
function addCmdHistory(cmd) {
	commands.push(cmd);
	historyPoint = 1;
}
function processHistory(input, up) {
	if (up) {
		var oldcmd = commands[commands.length - historyPoint];

		if (oldcmd) {
			input.val(oldcmd);
		}
		if (historyPoint < commands.length) {
			historyPoint++;
		}
		
	} else {
		if (historyPoint > 1) {
			historyPoint--;
		}
		var oldcmd = commands[commands.length - historyPoint];

		if (oldcmd) {
			input.val(oldcmd);
		}
	}

}
function processInput(input) {
	var command = input.val().trim();
	if (command == '') {
		return;
	}
	cmd = command;

	var url = esUrl;
	if (!command.startsWith('sp/')) {
		if (command.startsWith('_cat/')) {
		} else {
			url = url + '_cat/';
		}

		if (command == 'help') {
			command = '';
		} else {
			if (command.indexOf('?') < 0) {
				command += '?v'
			} else if (command.indexOf('&v') < 0) {
				command += '&v'
			}
		}
	} else {
		url = url + '_sp/';
		command = command.substring(3);
	}
	url += command;
	$.get(url, null, function(data, status) {
		processCommand(data, status);
	}, 'text').fail(function(e) {
		console.info(e);
		processError(e);
	});
}
function processCommand(data, status) {
	console.info(data);
	console.info(status);
	if (status = 'success') {
		dealDataLine(data);
	}
}

function dealDataLine(data) {
	// the cat help
	console.info(cmd);
	if (cmd == 'help') {
		data = data.replace(/\/_cat\//gm, '');
		console.info(data);
	}
	if (cmd.startsWith('sp/')) {
		data = data.replace(/\/_sp/gm, 'sp');
		console.info(data);
	}

	var line = document.createElement('p');
	var sp = ' ';

	addCmdHistory(cmd);

	var oldcmd = commands[commands.length - 1];

	var str = '<span style=" color: yellow;">' + oldcmd + ' '
			+ '</span> : <span> <pre>' + data + '</pre></span>';
	// + '</span> : <span> ' + data + '</span>';

	line.innerHTML = str;
	showDiv.append(line);
	scorllDown();

	showInput.val('');
}

function dealDataLineNew(data) {
	var line = document.createElement('p');
	var sp = ' ';

	var datas = data.split("\r\n");

	// var str = '<span style=" color: yellow;">' + sp
	// + '</span> : <span> <code>' + data + '</code></span>';
	// //+ '</span> : <span> ' + data + '</span>';

	for (l in datas) {
		var str = '<span style=" color: yellow;">' + sp
				+ '</span> : <span> <code>' + data + '</code></span>';
		line.innerHTML = str;
	}

	line.innerHTML = str;
	showDiv.append(line);
	scorllDown();
}

function scorllDown() {
	//
	if (!scrollLock) {
		showDiv[0].scrollTop = 1000000;
	}

	// div.scrollTop = div.scrollHeight;
}

function init() {
	//
	var showSingle = false;
	showDiv = $('#showDiv');
	showInput = $('#showInput');
	showUrl = $('#showUrl');

	esUrl = "";
	lastError = null;
	selected = '';

	var url = window.location;
	esUrl = "http://" + url.host + "/";

	if (showSingle || !url.host) {
		esUrl = defaultUrl;
	}
	// url = url.substring(0, url.indexOf('/'));

	scrollLock = false;

	showUrl.val(esUrl);
	connect();
	showDiv.append(helpText);

	showInput[0].focus();

	$(document).keyup(function(e) {
		// enter
		if (e.keyCode == 13) {
			processInput(showInput);
		}
		// up
		if (e.keyCode == 38) {
			processHistory(showInput,true);
		}else if(e.keyCode == 40) {
			processHistory(showInput,false);
		}
	});

	$(document).contextmenu(function(e) {
		if (selected) {
			showInput.val(showInput.val() + selected);
		}
	});

	$(document).click(function(e) {
		var str = getSelectedText();
		if (str) {
			selected = str;
		}
		console.info(selected);

	});

	commands = new Array();
	cmd = '';
}
function connect() {
	console.info("connect...");
	var url = showUrl.val();
	if (!url.endsWith('/')) {
		url = url + '/';
	}
	esUrl = url;
	$.get(url + "_cat", null, function(data, status) {
		processConnect(data, status);
	}, 'text').fail(function(e) {
		console.info(e);
		processError(e);
	});
}
function processConnect(data, status) {
	console.info("connecting data deal...");
	// console.info(data);
	// console.info(status);
	if (status = 'success') {
		showDiv
				.append("<p style='color:yellow;'>connect... success</p><p  style='color:yellow;'>-----</p>");
	}
	scorllDown();
}
function processError(e) {
	lastError = e;
	// if (status = 'success') {
	var errorMsg = lastError.responseText;
	console.info(errorMsg);
	showDiv
			.append("<p style='color:red;'>"
					+ showInput.val().trim()
					+ " : "
					+ e.statusText
					+ " "
					+ e.status
					+ " \r\n <input type='button' value='detail' onclick='alert($(this).next().html())'/><span style='visibility:hidden'>"
					+ errorMsg + "</span></p>"
					+ "<p  style='color:yellow;'>-----</p>");
	// lastError.responseText
	// }
	scorllDown();

}

function getSelectedText() {
	try {
		var selecter = window.getSelection().getRangeAt(0).toString();
		if (selecter != null && selecter.trim() != "") {
			return selecter;
		}
	} catch (e) {
		console.warn(e);
	}
	return '';

}
