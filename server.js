var app = require('./server-config.js');


var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server on prod now listening on port ' + port);
