import { MessageBase } from './base';
import { GroupMember, User } from './utils';

export interface FriendMessage extends MessageBase {
    type: 'FriendMessage';
    sender: User;
}

export interface GroupMessage extends MessageBase {
    type: 'GroupMessage';
    sender: GroupMember;
}

export interface TempMessage extends MessageBase {
    type: 'TempMessage';
    sender: GroupMember;
}

export interface StrangerMessage extends MessageBase {
    type: 'StrangerMessage';
    sender: User;
}

export interface OtherClientMessage extends MessageBase {
    type: 'OtherClientMessage';
    sender: {
        id: number;
        platform: string;
    };
}
