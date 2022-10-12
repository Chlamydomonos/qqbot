import { EVENT_DICT as MCL_EVENT_DICT } from '../mcl_definition';
import { EVENT_DICT as MCL_WS_EVENT_DICT } from '../app/mcl/WSClient';
import { EVENT_DICT as MCL_HTTP_EVENT_DICT } from '../app/mcl/HTTPClient';
import app from '../app';
import EventEmitter from 'node:events';

type AllEventsDict = typeof MCL_EVENT_DICT & typeof MCL_WS_EVENT_DICT & typeof MCL_HTTP_EVENT_DICT;

type AllEvents = keyof AllEventsDict;

type Event<K extends AllEvents> = AllEventsDict[K];

export interface IGlobalEventEmitter {
    on<T extends AllEvents>(eventName: T, listener: (e: Event<T>) => void): this;
    emit<T extends AllEvents>(eventName: T, event: Event<T>): boolean;
}

export default class GlobalEventEmitter extends EventEmitter implements IGlobalEventEmitter {
    constructor() {
        super();
    }

    start() {
        for (const i in MCL_EVENT_DICT) {
            app.mclWsClient.on(i, (e) => this.emit(i, e));
        }

        for (const i in MCL_WS_EVENT_DICT) {
            app.mclWsClient.on(i, (e) => this.emit(i, e));
        }

        for (const i in MCL_HTTP_EVENT_DICT) {
            app.mclHttpClient.on(i, (e) => this.emit(i, e));
        }
    }
}
