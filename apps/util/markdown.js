importScripts('/lib/linkjs-ext/responder.js');
importScripts('/apps/util/lib/marked.js');

marked.setOptions({ gfm: true, tables: true });
function headerRewrite(headers) {
	headers['content-type'] = 'text/html';
	return headers;
}
function bodyRewrite(md) { return (md) ? marked(md) : ''; }

app.onHttpRequest(function(request, response) {
	var mdRequest = Link.request({
		method  : 'get',
		url     : app.config.baseUrl + request.path,
		headers : { accept:'text/plain' }
	});
	Link.responder(response).pipe(mdRequest, headerRewrite, bodyRewrite);
});
app.postMessage('loaded');