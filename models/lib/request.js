//var $ = require("jquery");
var http = require("http");
var iconv = require("iconv-lite");
var util = require("./util");

function get(options, callback) {
	var content = "";
	var request = http.request(options, function (res) {
			console.log(util.dateFormat("Y-m-d H:i:s") + '  STATUS ' + res.statusCode);
			res.setEncoding('binary'); //or hex
			res.on('data', function (chunk) {
				content += chunk;
			});
			res.on('end', function () {
				var buf = new Buffer(content, 'binary');
				var html = iconv.decode(buf, 'GBK'); //将GBK编码的字符转换成utf8的
				callback(html);
			});
		});

	request.on('error', function (e) {
		console.log("error:" + e.message);
	});
	request.end();
}

module.exports = {
    get : get
}