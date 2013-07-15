// == SECTION helpers 

// pipe()

done = false;
startTime = Date.now();
var res = local.web.dispatch({ method:'get', url:'httpl://test.com/pipe' });
res.then(printSuccess, printError).then(finishTest);
wait(function () { return done; });

/* =>
success
{
  body: "SERVICE RESOURCE",
  headers: {
    "content-type": "text/piped+plain",
    link: [
      {href: "/", rel: "self current"},
      {href: "/events", id: "events", rel: "collection"},
      {href: "/foo", id: "foo", rel: "collection"},
      {href: "/{id}", rel: "collection"}
    ]
  },
  reason: "ok",
  status: 200
}
*/


// queryLink(s)

startTime = Date.now();
var links = [
  { rel: 'foo service via', href: 'http://whatever.com', id: 'whatever', title: 'Whatever' },
  { rel: 'foo collection whatever.com/rel/collection', href: 'http://whatever.com/stuff', id: 'stuff', title: 'Whatever Stuff' },
  { rel: 'foo item http://whatever.com/rel/item other.com/-item', href: 'http://whatever.com/stuff/{id}', title: 'Whatever Item' }
];
print(local.web.queryLinks(links, { rel: 'foo' }).length);
// => 3
print(local.web.queryLinks(links, { rel: 'foo service' }).length);
// => 1
print(local.web.queryLinks(links, { rel: 'whatever.com/rel/collection' }).length);
// => 1
print(local.web.queryLinks(links, { rel: 'http://whatever.com/rel/collection' }).length);
// => 0
print(local.web.queryLinks(links, { rel: 'foo', id: 'whatever' }).length);
// => 1
print(local.web.queryLinks(links, { rel: 'other.com/-item' }).length);
// => 1
finishTest();


// preferredType(s)
startTime = Date.now();
print(local.web.preferredTypes('text/html, application/*;q=0.2, image/jpeg;q=0.8'));
// => ['text/html', 'application/*', 'image/jpeg']
print(local.web.preferredTypes('text/html, application/*;q=0.2, image/jpeg;q=0.8', ['text/html', 'text/plain', 'application/json']));
// => ['text/html', 'application/json']
print(local.web.preferredType('text/html, application/*;q=0.2, image/jpeg;q=0.8', ['text/html', 'text/plain', 'application/json']));
// => text/html
finishTest();