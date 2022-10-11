import type { Group, Permission } from '../event/utils';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';
import type { Anno, GroupConfig } from './utils';

export interface MuteReq extends SessionReqBase {
    target: number;
    memberId: number;
    time?: number;
}

export interface Mute extends ReqResBase<MuteReq, ResponseBase> {
    path: '/mute';
    method: 'POST';
}

export interface UnmuteReq extends SessionReqBase {
    target: number;
    memberId: number;
}

export interface Unmute extends ReqResBase<UnmuteReq, ResponseBase> {
    path: '/unmute';
    method: 'POST';
}

export interface KickReq extends SessionReqBase {
    target: number;
    memberId: number;
    msg?: string;
}

export interface Kick extends ReqResBase<KickReq, ResponseBase> {
    path: '/kick';
    method: 'POST';
}

export interface QuitReq extends SessionReqBase {
    target: number;
}

export interface Quit extends ReqResBase<QuitReq, ResponseBase> {
    path: '/quit';
    method: 'POST';
}

export interface MuteAllReq extends SessionReqBase {
    target: number;
}

export interface MuteAll extends ReqResBase<MuteAllReq, ResponseBase> {
    path: '/muteAll';
    method: 'POST';
}

export interface UnmuteAll extends ReqResBase<MuteAllReq, ResponseBase> {
    path: '/unmuteAll';
    method: 'POST';
}

export interface SetEssenceReq extends SessionReqBase {
    messageId: number;
    target: number;
}

export interface SetEssence extends ReqResBase<SetEssenceReq, ResponseBase> {
    path: '/setEssence';
    method: 'POST';
}

export interface GetGroupConfigReq extends SessionReqBase {
    target: number;
}

export interface GetGroupConfig
    extends ReqResBase<GetGroupConfigReq, GroupConfig> {
    path: '/groupConfig';
    method: 'GET';
}

export interface PostGroupConfigReq extends SessionReqBase {
    target: number;
    config: Partial<GroupConfig>;
}

export interface PostGroupConfig
    extends ReqResBase<PostGroupConfigReq, ResponseBase> {
    path: '/groupConfig';
    method: 'POST';
}

export interface GetMemberInfoReq extends SessionReqBase {
    target: number;
    memberId: number;
}

export interface GetMemberInfoRes {
    id: number;
    memberName: string;
    specialTitle: string;
    permission: Permission;
    joinTimestamp: number;
    lastSpeakTimestamp: number;
    muteTimeRemaining: number;
    group: Group;
}

export interface GetMemberInfo
    extends ReqResBase<GetMemberInfoReq, GetMemberInfoRes> {
    path: '/memberInfo';
    method: 'GET';
}

export interface PostMemberInfoReq extends SessionReqBase {
    target: number;
    memberId: number;
    info: {
        name?: string;
        specialTitle?: string;
    };
}

export interface PostMemberInfo
    extends ReqResBase<PostMemberInfoReq, ResponseBase> {
    path: '/memberInfo';
    method: 'POST';
}

export interface MemberAdminReq extends SessionReqBase {
    target: number;
    memberId: number;
    assign: boolean;
}

export interface MemberAdmin extends ReqResBase<MemberAdminReq, ResponseBase> {
    path: '/memberAdmin';
    method: 'POST';
}

export interface AnnoListReq extends SessionReqBase {
    id: number;
    offset?: number;
    size?: number;
}

export interface AnnoListRes extends ResponseBase {
    data: Anno[];
}

export interface AnnoList extends ReqResBase<AnnoListReq, AnnoListRes> {
    path: '/anno/list';
    method: 'GET';
}

export interface AnnoPublishReq extends SessionReqBase {
    target: number;
    content: string;
    sendToNewMember?: boolean;
    pinned?: boolean;
    showEditCard?: boolean;
    showPopup?: boolean;
    requireConfirmation?: boolean;
    imageUrl?: string;
    imagePath?: string;
    imageBase64?: string;
}

export interface AnnoPublishRes extends ResponseBase {
    data: Anno[];
}

export interface AnnoPublish
    extends ReqResBase<AnnoPublishReq, AnnoPublishRes> {
    path: '/anno/publish';
    method: 'POST';
}

export interface AnnoDeleteReq extends SessionReqBase {
    id: number;
    fid: string;
}

export interface AnnoDelete extends ReqResBase<AnnoDeleteReq, ResponseBase> {
    path: '/anno/delete';
    method: 'POST';
}
