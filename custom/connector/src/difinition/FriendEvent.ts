import { FriendEventBase } from './base';

export interface FriendInputStatusChangedEvent extends FriendEventBase {
    type: 'FriendInputStatusChangedEvent';
    inputting: boolean;
}

export interface FriendNickChangedEvent extends FriendEventBase {
    type: 'FriendNickChangedEvent';
    from: string;
    to: string;
}
