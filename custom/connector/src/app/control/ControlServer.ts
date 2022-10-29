import net from 'net';
import app from '..';

interface ControlServerDataEvent {
    socket: net.Socket;
    data: string;
}

interface ControlServerErrorEvent {
    error: any;
}

export const EVENT_DICT = {
    'control_server:data': null as unknown as ControlServerDataEvent,
    'control_server:error': null as unknown as ControlServerErrorEvent,
    'control_server:client_error': null as unknown as ControlServerErrorEvent,
};

export default class ControlServer {
    private server: net.Server;
    constructor() {
        this.server = net.createServer();
    }

    start() {
        this.server.on('connection', (socket) => {
            socket.on('data', (data) => {
                try {
                    const dataStr = data.toString();
                    app.eventEmitter.emit('control_server:data', { socket: socket, data: dataStr });
                } catch (e) {
                    app.eventEmitter.emit('control_server:client_error', { error: e });
                }
            });
            socket.on('error', (err) => {
                app.eventEmitter.emit('control_server:client_error', { error: err });
            });
        });
        this.server.on('error', (err) => {
            app.eventEmitter.emit('control_server:error', { error: err });
        });

        app.eventEmitter.on('control_server:data', async (event, listenerData) => {
            const data = event.data as string;
            listenerData.core = { read: true };
            if (/^\s*stop\s*$/.test(data)) {
                listenerData.core.stoppingApp = true;
                event.socket.write('Received stop request. Stopping app.');
                app.stop();
            }
            return;
        });

        this.server.listen(8764);
    }

    stop() {
        this.server.close();
    }
}
