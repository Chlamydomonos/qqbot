import { client, connection, Message } from 'websocket';
import type { Url } from 'url';
import {
    EventNames as MclEventNames,
    EventDict as MclEventDict,
    WsEvent,
    isEventName as mcl_isEventName,
} from '../mcl_definition';
import { EventEmitter } from 'node:events';

export interface Connect {}

export interface ConnectFail {
    error: Error;
}

export interface Close {
    code: number;
    desc: string;
}

export interface WsError {
    error: Error;
}

export const EVENT_DICT = {
    'ws:Connect': null as unknown as Connect,
    'ws:ConnectFail': null as unknown as ConnectFail,
    'ws:Close': null as unknown as Close,
    'ws:Error': null as unknown as WsError,
};

type EventDict = typeof EVENT_DICT;

type AllEvents = keyof EventDict | MclEventNames;

type ExpandEventDict = EventDict & MclEventDict;

type EventObj<E extends AllEvents> = E extends keyof ExpandEventDict
    ? ExpandEventDict[E]
    : never;

export default class WSClient extends EventEmitter {
    private ws: client;
    private connection?: connection;
    on<N extends AllEvents>(
        eventName: N,
        listener: (event: EventObj<N>) => void
    ) {
        return super.on(eventName, listener);
    }
    emit<N extends AllEvents>(eventName: N, eventObj: EventObj<N>) {
        return super.emit(eventName, eventObj);
    }
    constructor(private url: string | Url) {
        super();
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
        this.emit('ws:Connect', {});
    }

    private onConnectFail(err: Error) {
        console.log(`Ws Connect Fail: ${err}`);
        this.emit('ws:ConnectFail', { error: err });
    }

    private onMessage(message: Message) {
        console.log(
            `Ws Received: ${message.type == 'utf8' ? message.utf8Data : ''}`
        );
        if (message.type == 'utf8') {
            const msg = (JSON.parse(message.utf8Data) as WsEvent).data;
            const msgType = `mcl:${msg.type}`;
            if (mcl_isEventName(msgType)) {
                this.emit(msgType, msg);
            }
        }
    }

    private onClose(code: number, desc: string) {
        console.log('Ws Closed');
        this.emit('ws:Close', { code: code, desc: desc });
    }

    private onError(err: Error) {
        console.log(`Ws Error: ${err}`);
        this.emit('ws:Error', { error: err });
    }

    start() {
        this.ws?.connect(this.url);
    }

    stop() {
        this.connection?.close();
    }
}
