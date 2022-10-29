const net = require('net');
const client = net.createConnection(8764);
console.log('Trying to send "stop" to control server...');
client.on('connect', () => {
    client.write('stop');
    client.end();
});
client.on('error', (err) => {
    console.log('Cannot connect to control server');
    console.log(err);
});
