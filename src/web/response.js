// Response
// ========
// EXPORTED
// Interface for receiving responses
// - usually internally and returned by `dispatch`
function Response() {
	local.util.EventEmitter.call(this);

	this.status = 0;
	this.reason = null;
	this.headers = {};

	this.isConnOpen = true;
	this.keepHistory('data');
	this.keepHistory('end');
	this.keepHistory('close');
}
local.web.Response = Response;
Response.prototype = Object.create(local.util.EventEmitter.prototype);

Response.prototype.setHeader    = function(k, v) { this.headers[k] = v; };
Response.prototype.getHeader    = function(k) { return this.headers[k]; };
Response.prototype.removeHeader = function(k) { delete this.headers[k]; };

// writes the header to the response
// - emits the 'headers' event
Response.prototype.writeHead = function(status, reason, headers) {
	this.status = status;
	this.reason = reason;
	if (headers) {
		for (var k in headers) {
			if (headers.hasOwnProperty(k))
				this.setHeader(k, headers[k]);
		}
	}

	this.emit('headers', this);
	return this;
};

// sends data over the stream
// - emits the 'data' event
Response.prototype.write = function(data) {
	if (!this.isConnOpen)
		return;
	if (typeof data != 'string')
		data = local.web.contentTypes.serialize(data, this.headers['content-type']);
	this.emit('data', data);
};

// ends the response stream
// - `data`: optional mixed, to write before ending
// - emits 'end' and 'close' events
Response.prototype.end = function(data) {
	if (!this.isConnOpen)
		return;
	if (data)
		this.write(data);
	this.emit('end');
	this.close();
};

// closes the stream, aborting if not yet finished
// - emits 'close' event
Response.prototype.close = function() {
	if (!this.isConnOpen)
		return;
	this.isConnOpen = false;
	this.emit('close');
	this.removeAllListeners('headers');
	this.removeAllListeners('data');
	this.removeAllListeners('end');
	this.removeAllListeners('close');
};