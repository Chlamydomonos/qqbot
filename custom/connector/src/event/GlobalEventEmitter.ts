import { EVENT_DICT as MCL_EVENT_DICT } from '../mcl_definition';
import { EVENT_DICT as MCL_WS_EVENT_DICT } from '../app/mcl/WSClient';
import { EVENT_DICT as MCL_HTTP_EVENT_DICT } from '../app/mcl/HTTPClient';
import app from '../app';
import EventEmitter from 'node:events';

export interface IGlobalEventEmitter {
    on(eventName: string, listener: (event: any, listenerData?: Record<string, any>) => void): this;
    emit(eventName: string, event: any): boolean;
}

export default class GlobalEventEmitter extends EventEmitter implements IGlobalEventEmitter {
    constructor() {
        super();
    }

    emit(eventName: string, event: any): boolean {
        return super.emit(eventName, event, {});
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
