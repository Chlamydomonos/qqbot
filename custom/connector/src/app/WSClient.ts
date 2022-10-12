import { client, connection, Message } from 'websocket';
import type { Url } from 'url';

export default class WSClient {
    private ws: client;
    private connection?: connection;
    constructor(private url: string | Url) {
        this.ws = new client();
        this.ws.on('connect', (connection) => this.onConnect(connection));
        this.ws.on('connectFailed', (err) => this.onConnectFail(err));
    }

    private onConnect(connection: connection) {
        console.log('Ws Connected');
        this.connection = connection;
        connection.on('message', (message) => this.onMessage(message));
        connection.on('close', (code, desc) => this.onClose(code, desc));
        connection.on('error', (err) => this.onError(err));
    }

    private onConnectFail(err: Error) {
        console.log(`Ws Connect Fail: ${err}`);
    }

    private onMessage(message: Message) {
        console.log(
            `Ws Received: ${message.type == 'utf8' ? message.utf8Data : ''}`
        );
    }

    private onClose(code: number, desc: string) {
        console.log('Ws Closed');
    }

    private onError(err: Error) {
        console.log(`Ws Error: ${err}`);
    }

    start() {
        this.ws?.connect(this.url);
    }

    stop() {
        this.connection?.close();
    }
}
