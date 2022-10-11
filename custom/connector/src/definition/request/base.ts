import type { Code } from './utils';

export interface ReqResBase<T, U> {
    path: string;
    method: 'GET' | 'POST';
    request: T;
    response: U;
    isFormData?: boolean;
}

export interface ResponseBase {
    code: Code;
    msg?: string;
}

export interface SessionReqBase {
    sessionKey: string;
}

export interface MsgSendBase {
    type: string;
}
