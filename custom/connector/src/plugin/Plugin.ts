import type { IHttpClient as IMclHttpClient } from '../app/mcl/HTTPClient';
import type { IGlobalEventEmitter } from '../event/GlobalEventEmitter';
import EventEmitter from 'node:events';

type EventDict = Record<string, unknown>;

type EventConstructor<T> = {
    new (...args: any[]): T & {};
};

type EventMap<T extends EventDict> = {
    [EventName in keyof T]: EventConstructor<T[EventName]>;
};

type DataMap<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = {
    [key: string]: any;
};

type Method<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = (this: PluginThis<E, D, PubM, PriM>, ...args: any[]) => any;

type MethodMap<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = {
    [key: string]: Method<E, D, PubM, PriM>;
};

export interface PluginInstanceFields {
    botEventEmitter: IGlobalEventEmitter;
    miraiHttpClient: IMclHttpClient;
}

export interface PluginInstanceEventEmitter<E extends EventDict> {
    emit<N extends keyof E, O extends E[N]>(name: N, event: O): void;
}

export interface PluginInstanceEventHandler<E extends EventDict> {
    on<N extends keyof E, O extends E[N]>(name: N, listener: (event: O) => void): this;
}

export type PluginInstanceData<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = {
    [key in keyof D]: D[key];
};

export type PluginInstancePublicMethods<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = PubM;

export type PluginInstancePrivateMethods<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = PriM;

export type PluginThis<
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = PluginInstanceFields &
    PluginInstanceEventEmitter<E> &
    PluginInstanceData<E, D, PubM, PriM> &
    PluginInstancePublicMethods<E, D, PubM, PriM> &
    PluginInstancePrivateMethods<E, D, PubM, PriM>;

export type PluginApi<
    N extends string,
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = { name: N } & PluginInstanceEventHandler<E> & PluginInstancePublicMethods<E, D, PubM, PriM>;

export type PluginInstance<
    N extends string,
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> = PluginThis<E, D, PubM, PriM> & PluginApi<N, E, D, PubM, PriM>;

export type PluginListGetter = <
    P extends PluginApi<N, E, D, PubM, PriM>,
    N extends string,
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
>(
    name: N
) => P;

export interface PluginBase<
    N extends string,
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
> {
    name: N;
    data: D;
    emits: EventMap<E>;
    publicMethods: PubM;
    privateMethods: PriM;
}

class OutEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

export function definePlugin<
    N extends string,
    E extends EventDict,
    D extends DataMap<E, D, PubM, PriM>,
    PubM extends MethodMap<E, D, PubM, PriM>,
    PriM extends MethodMap<E, D, PubM, PriM>
>(base: PluginBase<N, E, D, PubM, PriM>) {
    let out: any = new OutEmitter();
    out.name = base.name;
    if (base.emits) {
        out.emits = base.emits;
    }
    if (base.data) {
        for (const key in base.data) {
            out[key] = base.data[key];
        }
    }
    if (base.publicMethods) {
        for (const key in base.publicMethods) {
            out[key] = base.publicMethods[key];
        }
    }
    if (base.privateMethods) {
        for (const key in base.privateMethods) {
            out[key] = base.privateMethods[key];
        }
    }

    return out as PluginApi<N, E, D, PubM, PriM>;
}
