var request = require('request')
var http = require('http')

var port = process.env.PORT || 3000

http.createServer(function (req, res) {
	if (req.method !== 'POST') {
		res.writeHead(400)
		res.end('POST required, you used (' + req.method + ').')
		return
	}

	res.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	})

	var data = ''
	req.on('data', function (blob) {
		data += blob
	})
	req.on('end', function () {
		var body = JSON.parse(data)

		var headers = body.headers || {};
		headers['User-Agent'] = 'Magister.js User Tryout'

		var method = body.method.toLowerCase()

		request({
			url: body.url,
			method: method,
			headers: headers,
			json: body.data,
		}, function (error, response, content) {
			res.end(JSON.stringify({
				error: error,
				headers: response && response.headers,
				content: content,
				statusCode: response && response.statusCode,
			}))
		})
	})
}).listen(port, function () {
	console.log('running on port: %s.', port)
})
