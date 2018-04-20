var openssl = require('openssl-wrapper');
var password = 'github';

return openssl.exec('genrsa', {des3: true, passout: 'pass:' + password, '2048': false}, function(err, buffer) {
    console.log(buffer.toString());
}); 	