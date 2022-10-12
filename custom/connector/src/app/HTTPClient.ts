import axios from 'axios';
import {
    AllPaths as MclAllPaths,
    Api as MclApi,
    canGet as mcl_canGet,
    canPost as mcl_canPost,
    ClearPaths as MclClearPaths,
    isClear as mcl_isClear,
    MCL_HTTP_ROOT,
    Method as MclMethod,
    Methods,
    UnclearPaths as MclUnclearPaths,
} from '../mcl_definition';
import type { ReqResBase } from '../mcl_definition/request/base';

type Mm<P extends MclAllPaths> = P extends MclClearPaths
    ? MclMethod<P>
    : Methods;

type Req<A> = A extends ReqResBase<infer R, any> ? R : never;
type Res<A> = A extends ReqResBase<any, infer R> ? R : never;

class HTTPClient {
    async sendToMcl<
        P extends MclClearPaths,
        M extends Mm<P>,
        A extends MclApi<P, M>
    >(path: P, request: Req<A>): Promise<Res<A>>;
    async sendToMcl<
        P extends MclUnclearPaths,
        M extends 'GET' | 'POST',
        A extends MclApi<P, M>
    >(path: P, request: Req<A>, method: M): Promise<Res<A>>;
    async sendToMcl<
        P extends MclAllPaths,
        M extends Mm<P>,
        A extends MclApi<P, M>
    >(path: P, request: Req<A>, method?: M) {
        try {
            const url = MCL_HTTP_ROOT + path;
            if (mcl_isClear(path)) {
                if (mcl_canGet(path)) {
                    return (await axios.get<Res<A>>(url, { params: request }))
                        .data;
                } else if (mcl_canPost(path)) {
                    return (await axios.post<Res<A>>(url, request)).data;
                } else {
                    const fd = new FormData();
                    for (const k in request) {
                        const v = request[k];
                        if (v instanceof Blob) {
                            fd.append(k, v);
                        } else if (
                            typeof v == 'string' ||
                            typeof v == 'number'
                        ) {
                            fd.append(k, v.toString());
                        }
                    }
                    return (await axios.post<Res<A>>(url, fd)).data;
                }
            } else if (method == 'GET') {
                return (await axios.get<Res<A>>(url, { params: request })).data;
            } else {
                return (await axios.post<Res<A>>(url, request)).data;
            }
        } catch (e) {
            throw new MclError(e);
        }
    }
}

const test = new HTTPClient();

export default new HTTPClient();
