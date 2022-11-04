import type { EVENT_DICT as MCL_EVENT_DICT } from '../mcl_definition';
import type { EVENT_DICT as MCL_WS_EVENT_DICT } from '../app/mcl/WSClient';
import type { EVENT_DICT as MCL_HTTP_EVENT_DICT, IHttpClient } from '../app/mcl/HTTPClient';
import type { EVENT_DICT as PLUGIN_LOADER_EVENT_DICT, IPluginLoader } from './PluginLoader';
import type { EVENT_DICT as CONTROL_SERVER_EVENT_DICT } from '../app/control/ControlServer';
import type { Attributes, Model, ModelAttributes, ModelStatic } from 'sequelize';

type DataMap = Record<string, any>;
type MethodMap = Record<string, (...args: any[]) => any>;

type EmitMap = Record<string, any>;

type addPrefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;

type removePrefix<TPrefixedKey, TPrefix extends string> = TPrefixedKey extends addPrefix<infer TKey, TPrefix>
    ? TKey
    : '';

type prefixedValue<TObject extends object, TPrefixedKey extends string, TPrefix extends string> = TObject extends {
    [K in removePrefix<TPrefixedKey, TPrefix>]: infer TValue;
}
    ? TValue
    : never;

type addPrefixToObject<TObject extends object, TPrefix extends string> = {
    [K in addPrefix<keyof TObject, TPrefix>]: prefixedValue<TObject, K, TPrefix>;
};

type DefaultEmitMap = {
    ':start': {};
    ':stop': {};
    ':error': { error: unknown };
};

type DefaultEmits<Name extends string> = addPrefixToObject<DefaultEmitMap, Name>;

type CombineUnion<T> = (T extends any ? (param: T) => any : never) extends (param: infer P) => any ? P : never;

type EmitMaps<T extends DefaultPluginAPI[]> = {
    [key in number]: DefaultEmits<T[key]['name']>;
};

type EmitMapUnion<T extends DefaultPluginAPI[]> = EmitMaps<T>[keyof EmitMaps<T>];

type DependenciesEmitMap<T extends DefaultPluginAPI[]> = CombineUnion<T[number]['emits']> &
    CombineUnion<EmitMapUnion<T>>;

type CoreEventsDict = typeof MCL_EVENT_DICT &
    typeof MCL_WS_EVENT_DICT &
    typeof MCL_HTTP_EVENT_DICT &
    typeof PLUGIN_LOADER_EVENT_DICT &
    typeof CONTROL_SERVER_EVENT_DICT;

type AllEventsDict<Name extends string, Emits extends EmitMap, Listens extends DefaultPluginAPI[]> = CoreEventsDict &
    Emits &
    DefaultEmits<Name> &
    DependenciesEmitMap<Listens>;

export interface PluginDB {
    define<M extends Model<any, any>, TAttributes = Attributes<M>>(
        modelName: string,
        attributes: ModelAttributes<M, TAttributes>
    ): ModelStatic<M>;
}

interface PluginBase<Name extends string, Emits extends EmitMap, Listens extends DefaultPluginAPI[]> {
    httpClient: IHttpClient;
    pluginLoader: IPluginLoader;
    db: PluginDB;
    on<T extends keyof AllEventsDict<Name, Emits, Listens>>(
        eventName: T,
        listener: (event: AllEventsDict<Name, Emits, Listens>[T], listenerData?: Record<string, any>) => void
    ): this;
    on(eventName: string, listener: (event: any, listenerData?: Record<string, any>) => void): this;
    emit<T extends keyof Emits>(eventName: T, event: Emits[T]): boolean;
    name: Name;
    emits: Emits;
    listens: Listens;
}

type PluginThis<
    Name extends string,
    Data extends DataMap,
    PublicMethods extends MethodMap,
    PrivateMethods extends MethodMap,
    Emits extends EmitMap,
    Listens extends DefaultPluginAPI[]
> = PluginBase<Name, Emits, Listens> & Data & PublicMethods & PrivateMethods;

interface PluginAPIBase<Name extends string, Emits extends EmitMap> {
    name: Name;
    emits: Emits;
}

type PluginAPI<Name extends string, PublicMethods extends MethodMap, Emits extends EmitMap> = PluginAPIBase<
    Name,
    Emits
> &
    PublicMethods;

type DefaultPluginAPI = PluginAPI<string, MethodMap, EmitMap>;

interface PluginDef<
    Name extends string,
    Data extends DataMap,
    PublicMethods extends MethodMap,
    PrivateMethods extends MethodMap,
    Emits extends EmitMap,
    Listens extends DefaultPluginAPI[]
> {
    name: Name;
    data: Data & ThisType<never>;
    publicMethods: PublicMethods & ThisType<PluginThis<Name, Data, PublicMethods, PrivateMethods, Emits, Listens>>;
    privateMethods: PrivateMethods & ThisType<PluginThis<Name, Data, PublicMethods, PrivateMethods, Emits, Listens>>;
    emits: Emits;
    listens: Listens;
    onLoad: () => void;
}

interface NotLoadedPlugin<Name extends string, PublicMethods extends MethodMap, Emits extends EmitMap> {
    loaded: false;
    $toLoad: unknown;
}

interface LoadedPlugin<Name extends string, PublicMethods extends MethodMap, Emits extends EmitMap> {
    loaded: true;
    instance: PluginAPI<Name, PublicMethods, Emits>;
    $toLoad: unknown;
}

export type Plugin<Name extends string, PublicMethods extends MethodMap, Emits extends EmitMap> =
    | NotLoadedPlugin<Name, PublicMethods, Emits>
    | LoadedPlugin<Name, PublicMethods, Emits>;

export function definePlugin<
    Name extends string,
    Data extends DataMap,
    PublicMethods extends MethodMap,
    PrivateMethods extends MethodMap,
    Emits extends EmitMap,
    Listens extends DefaultPluginAPI[]
>(
    def: PluginDef<Name, Data, PublicMethods, PrivateMethods, Emits, Listens> &
        ThisType<PluginThis<Name, Data, PublicMethods, PrivateMethods, Emits, Listens>>
): Plugin<Name, PublicMethods, PrivateMethods> {
    return {
        loaded: false,
        $toLoad: def,
    };
}
