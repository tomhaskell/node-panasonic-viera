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
 * Internal Constants
 */
// urls
var URL_NETWORK			= '/nrc/control_0';
var URL_RENDERING		= '/dmr/control_0';

// urns
var URN_NETWORK			= 'panasonic-com:service:p00NetworkControl:1';
var URN_RENDERING		= 'schemas-upnp-org:service:RenderingControl:1';

// actions
var ACTION_SENDKEY		= 'X_SendKey';
var ACTION_GETVOLUME	= 'GetVolume';
var ACTION_SETVOLUME	= 'SetVolume';
var ACTION_GETMUTE		= 'GetMute';
var ACTION_SETMUTE		= 'SetMute';

// args
var ARG_SENDKEY			= 'X_KeyEvent';

/* 
 * Variables
 */
var ipAddress = "0.0.0.0";


/**
 * PanasonicViera contructor
 *
 * @param {string} ipAddress The IP Address of the TV
 */
function PanasonicViera(ipAddress){
	this.ipAddress = ipAddress;
}

/**
 * Create and submit XML request to the TV
 * 
 * @param  {String} url    The API endpoint required for this <action>
 * @param  {String} urn    The URN required for this <action>
 * @param  {String} action The action type to perform
 * @param  {Array}  option Options array - use ['args'] for action specific events
 */
PanasonicViera.prototype.submitRequest = function(url, urn, action, options){
	var self = this;
	var command_str = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"+
"<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n"+
" <s:Body>\n"+
"  <u:"+action+" xmlns:u=\"urn:"+urn+"\">\n"+
"   "+options['args']+"\n"+
"  </u:"+action+">\n"+
" </s:Body>\n"+
"</s:Envelope>\n";

	var post_options = {
		host: this.ipAddress,
		port: '55000',
		path: url,
		method: 'POST',
		headers: {
			'Content-Length': command_str.length,
			'Content-Type': 'text/xml; charset="utf-8"',
			'User-Agent': 'net.thlabs.nodecontrol',
			'SOAPACTION': '"urn:'+urn+'#'+action+'"'
		}
	}

	if(options.hasOwnProperty('callback')){
		self.callback = options['callback'];
	}else{
		self.callback = function(data){ console.log(data) };
	}

	//console.log(command_str);

	var req = http.request(post_options, function(res) {
		//console.log('STATUS: ' + res.statusCode);
		//console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', self.callback);
	});
	req.on('error', function(e) {
		console.log('error: ' + e.message);
		console.log(e);
	});

	req.write(command_str);
	req.end();

}

/**
 * Send a key state event to the TV
 * 
 * @param  {String} key   The key value to send
 * @param  {String} state <ON|OFF|ONOFF>
 */
PanasonicViera.prototype.sendKey = function(key, state){
	this.submitRequest(
		URL_NETWORK, 
		URN_NETWORK, 
		ACTION_SENDKEY, 
		{
			args: "<"+ARG_SENDKEY+">NRC_"+key+"-"+state+"</"+ARG_SENDKEY+">"
		}
	);
}
/**
 * Send a key press event to the TV 
 * 
 * @param  {String} key   The key that has been pressed
 */
PanasonicViera.prototype.keyDown = function(key){
	this.sendKey(key,'ON');
}
/**
 * Send a key release event to the TV
 * 
 * @param  {String} key   The key that has been released
 */
PanasonicViera.prototype.keyUp = function(key){
	this.sendKey(key,'OFF');
}
/**
 * Send a key push/release event to the TV
 * 
 * @param  {String} key   The key that has been released
 */
PanasonicViera.prototype.send = function(key){
	this.sendKey(key,'ONOFF');
}

/**
 * Get the current volume value
 * 
 * @param  {Function} callback A function of the form function(volume) to return the volume value to
 */
PanasonicViera.prototype.getVolume = function(callback){
	self = this;
	self.volCallback = callback;
	this.submitRequest(
		URL_RENDERING,
		URN_RENDERING,
		ACTION_GETVOLUME,
		{
			args: "<InstanceID>0</InstanceID><Channel>Master</Channel>",
			callback: function(data){
				var regex = /<CurrentVolume>(\d*)<\/CurrentVolume>/gm;
				var match = regex.exec(data);
				if(match !== null){
					var volume = match[1];
					self.volCallback(volume);
				}
			}
		}
	);
}
/**
 * Set the volume to specific level
 * 
 * @param  {int} volume The value to set the volume to
 */
PanasonicViera.prototype.setVolume = function(volume){
	this.submitRequest(
		URL_RENDERING,
		URN_RENDERING,
		ACTION_SETVOLUME,
		{
			args: "<InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>"+volume+"</DesiredVolume>"
		}
	);
}

/**
 * Get the current mute setting
 * 
 * @param  {Function} callback A function of the form function(mute) to return the volume value to
 */
PanasonicViera.prototype.getMute = function(callback){
	self = this;
	self.muteCallback = callback;
	this.submitRequest(
		URL_RENDERING,
		URN_RENDERING,
		ACTION_GETMUTE,
		{
			args: "<InstanceID>0</InstanceID><Channel>Master</Channel>",
			callback: function(data){
				var regex = /<CurrentMute>([0-1])<\/CurrentMute>/gm;
				var match = regex.exec(data);
				if(match !== null){
					var mute = (match[1] == '1');
					self.muteCallback(mute);
				}
			}
		}
	);
}
/**
 * Set mute to on/off
 * 
 * @param  {boolean} enable The value to set mute to
 */
PanasonicViera.prototype.setMute = function(enable){
	var data = (enable)? '1' : '0';
	this.submitRequest(
		URL_RENDERING,
		URN_RENDERING,
		ACTION_SETMUTE,
		{
			args: "<InstanceID>0</InstanceID><Channel>Master</Channel><DesiredMute>"+data+"</DesiredMute>"
		}
	);
}