import type {
    BotOfflineEventActive,
    BotOfflineEventDropped,
    BotOfflineEventForce,
    BotOnlineEvent,
    BotReloginEvent,
} from './BotEvent';
import type {
    FriendInputStatusChangedEvent,
    FriendNickChangedEvent,
    FriendRecallEvent,
} from './FriendEvent';
import type {
    BotGroupPermissionChangeEvent,
    BotJoinGroupEvent,
    BotLeaveEventActive,
    BotLeaveEventDisband,
    BotLeaveEventKick,
    BotMuteEvent,
    BotUnmuteEvent,
    GroupAllowAnonymousChatEvent,
    GroupAllowConfessTalkEvent,
    GroupAllowMemberInviteEvent,
    GroupEntranceAnnouncementChangeEvent,
    GroupMuteAllEvent,
    GroupNameChangeEvent,
    GroupRecallEvent,
    MemberCardChangeEvent,
    MemberHonorChangeEvent,
    MemberJoinEvent,
    MemberLeaveEventKick,
    MemberLeaveEventQuit,
    MemberMuteEvent,
    MemberPermissionChangeEvent,
    MemberSpecialTitleChangeEvent,
    MemberUnmuteEvent,
    NudgeEvent,
} from './GroupEvent';
import type {
    FriendMessage,
    GroupMessage,
    OtherClientMessage,
    StrangerMessage,
    TempMessage,
} from './Message';
import type {
    MsgApp,
    MsgAt,
    MsgAtAll,
    MsgDice,
    MsgFace,
    MsgFile,
    MsgFlashImage,
    MsgForwardMessage,
    MsgImage,
    MsgJson,
    MsgMarketFace,
    MsgMiraiCode,
    MsgMusicShare,
    MsgPlain,
    MsgPoke,
    MsgQuote,
    MsgSource,
    MsgVoice,
    MsgXml,
} from './MsgChainObj';
import type {
    BotInvitedJoinGroupRequestEvent,
    CommandExecutedEvent,
    MemberJoinRequestEvent,
    NewFriendRequestEvent,
    OtherClientOfflineEvent,
    OtherClientOnlineEvent,
} from './OtherEvent';
import type {
    FriendSyncMessage,
    GroupSyncMessage,
    StrangerSyncMessage,
    TempSyncMessage,
} from './SyncMessage';

export type MsgChainObj =
    | MsgSource
    | MsgQuote
    | MsgAt
    | MsgAtAll
    | MsgFace
    | MsgPlain
    | MsgImage
    | MsgFlashImage
    | MsgVoice
    | MsgXml
    | MsgJson
    | MsgApp
    | MsgPoke
    | MsgDice
    | MsgMarketFace
    | MsgMusicShare
    | MsgForwardMessage
    | MsgFile
    | MsgMiraiCode;

export type Event =
    | BotOnlineEvent
    | BotOfflineEventActive
    | BotOfflineEventForce
    | BotOfflineEventDropped
    | BotReloginEvent
    | FriendInputStatusChangedEvent
    | FriendNickChangedEvent
    | FriendRecallEvent
    | BotGroupPermissionChangeEvent
    | BotMuteEvent
    | BotUnmuteEvent
    | BotJoinGroupEvent
    | BotLeaveEventActive
    | BotLeaveEventKick
    | BotLeaveEventDisband
    | GroupRecallEvent
    | NudgeEvent
    | GroupNameChangeEvent
    | GroupEntranceAnnouncementChangeEvent
    | GroupMuteAllEvent
    | GroupAllowAnonymousChatEvent
    | GroupAllowConfessTalkEvent
    | GroupAllowMemberInviteEvent
    | MemberJoinEvent
    | MemberLeaveEventKick
    | MemberLeaveEventQuit
    | MemberCardChangeEvent
    | MemberSpecialTitleChangeEvent
    | MemberPermissionChangeEvent
    | MemberMuteEvent
    | MemberUnmuteEvent
    | MemberHonorChangeEvent
    | NewFriendRequestEvent
    | MemberJoinRequestEvent
    | BotInvitedJoinGroupRequestEvent
    | OtherClientOnlineEvent
    | OtherClientOfflineEvent
    | CommandExecutedEvent
    | FriendMessage
    | GroupMessage
    | TempMessage
    | StrangerMessage
    | OtherClientMessage
    | FriendSyncMessage
    | GroupSyncMessage
    | TempSyncMessage
    | StrangerSyncMessage;
