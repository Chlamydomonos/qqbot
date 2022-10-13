import type { IHttpClient as MiraiHttpClient } from '../app/mcl/HTTPClient';
import type BotEventEmitter from '../event/GlobalEventEmitter';
import EventEmitter from 'node:events';

type EmitMap = Record<string, any>;
type DataMap = Record<string, any>;
type MethodMap = Record<string, (...args: any[]) => any>;

interface PluginBase {
    botEventEmitter: BotEventEmitter;
    miraiHttpClient: MiraiHttpClient;
}

interface PluginEmit<E extends EmitMap> {
    emit<EN extends keyof E>(name: EN, event: E[EN]): boolean;
}

type PluginThis<N extends string, E extends EmitMap, D extends DataMap, P extends MethodMap, M extends MethodMap> = {
    name: N;
} & PluginBase &
    PluginEmit<E> &
    D &
    P &
    M;

interface PluginOn<E extends EmitMap> {
    on<EN extends keyof E>(name: EN, listener: (event: E[EN]) => void): this;
}

type PluginApi<N extends string, E extends EmitMap, D extends DataMap, P extends MethodMap> = {
    name: N;
} & PluginOn<E> &
    P;

type PluginCtrl = { onStart?: () => void; onStop?: () => void };

type PluginDef<N extends string, E extends EmitMap, D extends DataMap, P extends MethodMap, M extends MethodMap> = {
    name: N;
    emits?: E;
    data?: D & ThisType<void>;
    publicMethods?: P & ThisType<PluginThis<N, E, D, P, M>>;
    privateMethods?: M & ThisType<PluginThis<N, E, D, P, M>>;
} & PluginCtrl;

type Plugin<
    N extends string,
    E extends EmitMap,
    D extends DataMap,
    P extends MethodMap,
    M extends MethodMap
> = PluginThis<N, E, D, P, M> & PluginApi<N, E, D, P> & PluginCtrl;

type PluginConstructor<
    N extends string,
    E extends EmitMap,
    D extends DataMap,
    P extends MethodMap,
    M extends MethodMap
> = {
    new (): Plugin<N, E, D, P, M>;
};

class Out extends EventEmitter {}

export function definePlugin<
    N extends string,
    E extends EmitMap,
    D extends DataMap,
    P extends MethodMap,
    M extends MethodMap
>(def: PluginDef<N, E, D, P, M>) {
    function out(this: any) {
        this.name = def.name;
        if (def.data) {
            for (const k in def.data) {
                this[k] = def.data[k];
            }
        }
        if (def.publicMethods) {
            for (const k in def.publicMethods) {
                this[k] = def.publicMethods[k];
            }
        }
        if (def.privateMethods) {
            for (const k in def.privateMethods) {
                this[k] = def.privateMethods[k];
            }
        }
        if (def.onStart) {
            this.onStart = def.onStart;
        }
        if (def.onStop) {
            this.onStop = def.onStop;
        }
    }
    return out as unknown as PluginConstructor<N, E, D, P, M>;
}

export type PluginGetter = <
    N extends string,
    E extends EmitMap,
    D extends DataMap,
    P extends MethodMap,
    M extends MethodMap
>(
    obj: PluginConstructor<N, E, D, P, M>
) => PluginApi<N, E, D, P>;
