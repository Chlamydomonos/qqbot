import type { MsgChainSend } from '.';
import type { MsgChainObj } from '../event';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';

export interface SendFriendMessageReq extends SessionReqBase {
    target: number;
    messageChain: MsgChainSend[];
}

export interface SendFriendMessageRes extends ResponseBase {
    messageId: number;
}

export interface SendFriendMessage
    extends ReqResBase<SendFriendMessageReq, SendFriendMessageRes> {
    path: '/sendFriendMessage';
    method: 'POST';
}

export interface SendGroupMessageReq extends SessionReqBase {
    target: number;
    messageChain: MsgChainSend[];
}

export interface SendGroupMessageRes extends ResponseBase {
    messageId: number;
}

export interface SendGroupMessage
    extends ReqResBase<SendGroupMessageReq, SendGroupMessageRes> {
    path: '/sendGroupMessage';
    method: 'POST';
}

export interface SendTempMessageReq extends SessionReqBase {
    qq: number;
    group: number;
    messageChain: MsgChainSend[];
}

export interface SendTempMessageRes extends ResponseBase {
    messageId: number;
}

export interface SendTempMessage
    extends ReqResBase<SendTempMessageReq, SendTempMessageRes> {
    path: '/sendTempMessage';
    method: 'POST';
}

export interface SendNudgeReq extends SessionReqBase {
    target: number;
    subject: number;
    kind: 'Friend' | 'Group' | 'Stranger';
}

export interface SendNudge extends ReqResBase<SendNudgeReq, ResponseBase> {
    path: '/sendNudge';
    method: 'POST';
}

export interface RecallReq extends SessionReqBase {
    target: number;
    messageId: number;
}

export interface Recall extends ReqResBase<RecallReq, ResponseBase> {
    path: '/recall';
    method: 'POST';
}

export interface RoamingMessagesReq {
    timeStart: number;
    timeEnd: number;
    target: number;
}

export interface RoamingMessagesRes extends ResponseBase {
    data: MsgChainObj[];
}

export interface RoamingMessages
    extends ReqResBase<RoamingMessagesReq, RoamingMessagesRes> {
    path: '/roamingMessages';
    method: 'POST';
}