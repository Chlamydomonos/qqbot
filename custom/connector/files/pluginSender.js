const net = require('net');
const client = net.createConnection(8764);
console.log('Trying to send "stop" to control server...');
client.on('connect', () => {
    const par1 = process.argv[2];
    const par2 = process.argv[3];
    if(par1 == null || par2 == null) {
        client.end();
        return;
    }
    client.write(`${par1} ${par2}`);
    client.end();
});
client.on('error', (err) => {
    console.log('Cannot connect to control server');
    console.log(err);
});
