import type { MsgChainObj } from '.';

export interface MsgChainObjBase {
    type: string;
}

export interface EventBase {
    type: string;
}

export interface BotEventBase extends EventBase {
    qq: number;
}

export interface FriendEventBase extends EventBase {
    friend: {
        id: number;
        nickname: string;
        remark: string;
    };
}

export interface MessageBase extends EventBase {
    messageChain: MsgChainObj[];
}
