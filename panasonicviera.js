/*
 *  Node.js module for control of a Panasonic Viera TV
 *  
 *  Copyright (c) 2013 THLabs.net
 */

var http = require('http');

//Export the constructor
exports = module.exports = PanasonicViera;

/* 
 * Key Constants
 */
// power
exports.POWER_TOGGLE 	= 'POWER';
// channel
exports.CHANNEL_DOWN 	= 'CH_DOWN';
exports.CHANNEL_UP		= 'CH_UP';
// volume
exports.VOLUME_UP		= 'VOLUP';
exports.VOLUME_DOWN		= 'VOLDOWN';
exports.MUTE_TOGGLE 	= 'MUTE';
// source control
exports.TV				= 'TV';
exports.INTERNET		= 'INTERNET';
exports.CHANGE_INPUT	= 'CHG_INPUT';
exports.SD_CARD			= 'SD_CARD';
// number keypad
exports.D1				= 'D1';
exports.D2				= 'D2';
exports.D3				= 'D3';
exports.D4				= 'D4';
exports.D5				= 'D5';
exports.D6				= 'D6';
exports.D7				= 'D7';
exports.D8				= 'D8';
exports.D9				= 'D9';
exports.D0				= 'D0';
// arrow keypad
exports.MENU			= 'MENU';
exports.SUBMENU			= 'SUBMENU';
exports.RETURN			= 'RETURN';
exports.ENTER			= 'ENTER';
exports.RIGHT			= 'RIGHT';
exports.LEFT			= 'LEFT';
exports.UP				= 'UP';
exports.DOWN			= 'DOWN';
exports.DISP_MODE		= 'DISP_MODE';
exports.CANCEL			= 'CANCEL';
exports.INDEX			= 'INDEX';
// coloured buttons
exports.RED				= 'RED';
exports.GREEN			= 'GREEN';
exports.YELLOW			= 'YELLOW';
exports.BLUE			= 'BLUE';
// programme info
exports.GUIDE			= 'EPG';
exports.TEXT			= 'TEXT';
exports.INFO			= 'INFO';
// playback control
exports.REW				= 'REW';
exports.PLAY			= 'PLAY';
exports.FF				= 'FF';
exports.SKIP_PREV		= 'SKIP_PREV';
exports.PAUSE			= 'PAUSE';
exports.SKIP_NEXT		= 'SKIP_NEXT';
exports.STOP			= 'STOP';
exports.REC				= 'REC';
// misc
exports.VTOOLS			= 'VTOOLS';
exports.VIERA_LINK		= 'VIERA_LINK';
exports.STTL			= 'STTL';
exports.HOLD			= 'HOLD';
exports.R_TUNE			= 'R_TUNE';
exports._3D				= '3D';

/* 
 * Variables
 */
var ipAddress = "0.0.0.0";


/**
 * PanasonicViera contructor
 */
function PanasonicViera(ipAddress){
	this.ipAddress = ipAddress;
}


PanasonicViera.prototype.send = function(command){

	var command_str = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"+
"<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n"+
" <s:Body>\n"+
"  <u:X_SendKey xmlns:u=\"urn:panasonic-com:service:p00NetworkControl:1\">\n"+
"   <X_KeyEvent>NRC_"+command+"-ONOFF</X_KeyEvent>\n"+
"  </u:X_SendKey>\n"+
" </s:Body>\n"+
"</s:Envelope>\n";

	var post_options = {
		host: this.ipAddress,
		port: '55000',
		path: '/nrc/control_0',
		method: 'POST',
		headers: {
			'Content-Length': command_str.length,
			'Content-Type': 'text/xml; charset="utf-8"',
			'User-Agent': 'net.thlabs.nodecontrol',
			'SOAPACTION': '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"'
		}
	}

	console.log(command_str);

	var req = http.request(post_options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	});
	req.on('error', function(e) {
		console.log('error: ' + e.message);
		console.log(e);
	});

	req.write(command_str);
	req.end();

}
