/*
 *  Usage file for PanasonicViera module
 */

var PanasonicViera = require('./panasonicviera');
var readline = require('readline');

// create instance of module
var tv = new PanasonicViera('192.168.1.101');

// get mute value
tv.getMute(function(data){ 
	console.log('current mute: '+data);

});

// set volume to 20
tv.setVolume(20);


// get key press commands from command line
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

read = function(){
	rl.question("Command: ", function(command) {
		if(command == ''){
			rl.close();
		}else{
	  		tv.send(command);
	  		read();
	  	}
	});
}

read();

