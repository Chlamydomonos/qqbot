import type {
    BotProfile,
    DeleteFriend,
    FriendList,
    FriendProfile,
    GroupList,
    MemberList,
    MemberProfile,
    RespBotInvitedJoinGroupRequestEvent,
    RespMemberJoinRequestEvent,
    RespNewFriendRequestEvent,
    UserProfile,
} from './Account';
import type {
    FileList,
    FileInfo,
    FileDelete,
    FileMkdir,
    FileMove,
    FileRename,
    FileUpload,
    UploadImage,
    UploadVoice,
} from './File';
import type {
    AnnoDelete,
    AnnoList,
    AnnoPublish,
    GetGroupConfig,
    GetMemberInfo,
    Kick,
    MemberAdmin,
    Mute,
    MuteAll,
    PostGroupConfig,
    PostMemberInfo,
    Quit,
    SetEssence,
    Unmute,
    UnmuteAll,
} from './Group';
import type {
    App,
    At,
    AtAll,
    Dice,
    Face1,
    Face2,
    FlashImage1,
    FlashImage2,
    FlashImage3,
    FlashImage4,
    ForwardMessage1,
    ForwardMessage2,
    Image1,
    Image2,
    Image3,
    Image4,
    Json,
    MiraiCode,
    MusicShare,
    Plain,
    Poke,
    Quote,
    Voice1,
    Voice2,
    Voice3,
    Voice4,
    Xml,
} from './MsgChainSend';

export type MsgChainSend =
    | Quote
    | At
    | AtAll
    | Face1
    | Face2
    | Plain
    | Image1
    | Image2
    | Image3
    | Image4
    | FlashImage1
    | FlashImage2
    | FlashImage3
    | FlashImage4
    | Voice1
    | Voice2
    | Voice3
    | Voice4
    | Xml
    | Json
    | App
    | Poke
    | Dice
    | MusicShare
    | ForwardMessage1
    | ForwardMessage2
    | File
    | MiraiCode;

export type GetAPIs =
    | FriendList
    | GroupList
    | MemberList
    | BotProfile
    | FriendProfile
    | MemberProfile
    | UserProfile
    | GetGroupConfig
    | GetMemberInfo
    | AnnoList
    | FileList
    | FileInfo;

export type PostAPIs =
    | DeleteFriend
    | RespNewFriendRequestEvent
    | RespMemberJoinRequestEvent
    | RespBotInvitedJoinGroupRequestEvent
    | Mute
    | Unmute
    | Kick
    | Quit
    | MuteAll
    | UnmuteAll
    | SetEssence
    | PostGroupConfig
    | PostMemberInfo
    | MemberAdmin
    | AnnoPublish
    | AnnoDelete
    | FileMkdir
    | FileDelete
    | FileMove
    | FileRename
    | UploadImage
    | UploadVoice
    | FileUpload;

export type APIs = GetAPIs | PostAPIs;

export type UnclearAPIs =
    | GetGroupConfig
    | PostGroupConfig
    | GetMemberInfo
    | PostMemberInfo;

export type ClearAPIs = Exclude<APIs, UnclearAPIs>;

export function isUnclear(api: APIs): api is UnclearAPIs {
    return api.path == '/groupConfig' || api.path == '/memberInfo';
}

export function isClear(api: APIs): api is ClearAPIs {
    return !isUnclear(api);
}
