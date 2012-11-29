var p = require('./plivo');
var p1 =  p.Plivo();

p1.options.authId = "MAM2JMMZI0ZDE0Y2U2MZ";
p1.options.authToken = "ZDVlZTU0ZGEzZmI3NzAwODU1NDllMmJmNmJlNmJj";

console.log(p1.options.host);

var params = {};
params.from = "918050420391";
params.to = "917411201001";
params.answer_url = "http://dl.dropbox.com/u/109700465/answer_url.xml";

console.log(params);
var json = JSON.stringify(params);
console.log(json);
p1.make_call(params,function callback(err, response) {
    console.log(response.statusCode,response);
    console.log(err);
  }
);
