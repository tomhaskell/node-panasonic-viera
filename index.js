/*
 *  Usage file for PanasonicViera module
 */

var PanasonicViera = require('./panasonicviera');

var tv = new PanasonicViera('192.168.1.101');

var readline = require('readline');

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
