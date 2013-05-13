var http = require('http');

function sendToTV(command){

	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"+
"<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n"+
" <s:Body>\n"+
"  <u:X_SendKey xmlns:u=\"urn:panasonic-com:service:p00NetworkControl:1\">\n"+
"   <X_KeyEvent>NRC_"+command+"</X_KeyEvent>\n"+
"  </u:X_SendKey>\n"+
" </s:Body>\n"+
"</s:Envelope>\n";

	var post_options = {
		host: '192.168.1.101',
		port: '55000',
		path: '/nrc/control_0',
		method: 'POST',
		headers: {
			'Content-Length': xml.length,
			'Content-Type': 'text/xml; charset="utf-8"',
			'User-Agent': 'Panasonic Android VR-CP UPnP/2.0',
			'SOAPACTION': '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"'
		}
	}

	console.log(post_options);

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

	req.write(xml);
	req.end();

}

sendToTV('POWER-ONOFF');
