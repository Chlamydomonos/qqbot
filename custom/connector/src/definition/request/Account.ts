import type { Group, GroupMember, User } from '../event/utils';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';
import type { Profile } from './utils';

export interface FriendListRes extends ResponseBase {
    data: User[];
}

export interface FriendList extends ReqResBase<SessionReqBase, FriendListRes> {
    path: '/friendList';
    method: 'GET';
}

export interface GroupListRes extends ResponseBase {
    data: Group[];
}

export interface GroupList extends ReqResBase<SessionReqBase, GroupListRes> {
    path: '/groupList';
    method: 'GET';
}

export interface MemberListReq extends SessionReqBase {
    target: number;
}

export interface MemberListRes extends ResponseBase {
    data: GroupMember[];
}

export interface MemberList extends ReqResBase<MemberListReq, MemberListRes> {
    path: '/memberList';
    method: 'GET';
}

export interface BotProfile extends ReqResBase<SessionReqBase, Profile> {
    path: '/botProfile';
    method: 'GET';
}

export interface FriendProfileReq extends SessionReqBase {
    target: number;
}

export interface FriendProfile extends ReqResBase<FriendProfile, Profile> {
    path: '/friendProfile';
    method: 'GET';
}

export interface MemberProfileReq extends SessionReqBase {
    target: number;
    memberId: number;
}

export interface MemberProfile extends ReqResBase<MemberProfileReq, Profile> {
    path: '/memberProfile';
    method: 'GET';
}

export interface UserProfileReq extends SessionReqBase {
    target: number;
}

export interface UserProfile extends ReqResBase<UserProfileReq, Profile> {
    path: '/userProfile';
    method: 'GET';
}

export interface DeleteFriendReq extends SessionReqBase {
    target: number;
}

export interface DeleteFriend
    extends ReqResBase<DeleteFriendReq, ResponseBase> {
    path: '/deleteFriend';
    method: 'POST';
}

export interface RespNewFriendRequestEventReq extends SessionReqBase {
    eventId: number;
    fromId: number;
    groupId: number;
    operate: 0 | 1 | 2;
    message: string;
}

export interface RespNewFriendRequestEvent
    extends ReqResBase<RespNewFriendRequestEventReq, ResponseBase> {
    path: '/resp/newFriendRequestEvent';
    method: 'POST';
}

export interface RespMemberJoinRequestEventReq extends SessionReqBase {
    eventId: number;
    fromId: number;
    groupId: number;
    operate: 0 | 1 | 2 | 3 | 4;
    message: string;
}

export interface RespMemberJoinRequestEvent
    extends ReqResBase<RespMemberJoinRequestEventReq, ResponseBase> {
    path: '/resp/memberJoinRequestEvent';
    method: 'POST';
}

export interface RespBotInvitedJoinGroupRequestEventReq extends SessionReqBase {
    eventId: number;
    fromId: number;
    groupId: number;
    operate: 0 | 1;
    message: string;
}

export interface RespBotInvitedJoinGroupRequestEvent
    extends ReqResBase<RespBotInvitedJoinGroupRequestEventReq, ResponseBase> {
    path: '/resp/botInvitedJoinGroupRequestEvent';
    method: 'POST';
}
