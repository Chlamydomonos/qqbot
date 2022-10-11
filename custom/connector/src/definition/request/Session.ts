import type { MsgChainObj } from '../event';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';

export interface VerifyReq {
    verifyKey: string;
}

export interface VerifyRes extends ResponseBase {
    session: string;
}

export interface Verify extends ReqResBase<VerifyReq, VerifyRes> {
    path: '/verify';
    method: 'POST';
}

export interface BindReq extends SessionReqBase {
    qq: number;
}

export interface Bind extends ReqResBase<BindReq, ResponseBase> {
    path: '/bind';
    method: 'POST';
}

export interface SessionInfoRes extends ResponseBase {
    data: {
        sessionKey: string;
        qq: {
            id: number;
            nickname: string;
            remark: string;
        };
    };
}

export interface SessionInfo
    extends ReqResBase<SessionReqBase, SessionInfoRes> {
    path: '/sessionInfo';
    method: 'GET';
}

export interface ReleaseReq extends SessionReqBase {
    qq: number;
}

export interface Release extends ReqResBase<ReleaseReq, ResponseBase> {
    path: '/release';
    method: 'POST';
}

export interface AboutRes extends ResponseBase {
    data: {
        version: string;
    };
}

export interface About extends ReqResBase<undefined, AboutRes> {
    path: '/about';
    method: 'GET';
}

export interface BotListRes extends ResponseBase {
    data: number[];
}

export interface BotList extends ReqResBase<undefined, BotListRes> {
    path: '/botList';
    method: 'GET';
}

export interface MessageFormIdReq extends SessionReqBase {
    messageId: number;
    target: number;
}

export interface MessageFormIdRes extends ResponseBase {
    data: {
        type: 'FriendMessage' | 'GroupMessage' | 'TempMessage' | string;
        messageChain: MsgChainObj[];
    };
}

export interface MessageFormId
    extends ReqResBase<MessageFormIdReq, MessageFormIdRes> {
    path: '/messageFormId';
}
