request = require "request"
EJSON = require "ejson"
_ = require "lodash"

app = require("express")()

app.post "/", (req, res) ->
	res.header "Access-Control-Allow-Origin", "http://simplygits.github.io/"
	res.header "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"

	data = ""
	req.on "data", (blob) -> data += blob
	req.on "end", ->
		body = EJSON.parse data
		headers = _.extend (body.headers ? {}), "User-Agent": "Magister.js User Tryout"

		if _.contains ["post", "put"], body.method.toLowerCase() 
			request { url: body.url, method: body.method, headers, json: body.data }, (error, response = {}, content) ->
				res.send EJSON.stringify { error, headers: response.headers, content  }
		else
			request { url: body.url, method: body.method, headers }, (error, response = {}, content) ->
				res.send EJSON.stringify { error, headers: response.headers, content }

server = app.listen "80", -> console.log "running on port 80."