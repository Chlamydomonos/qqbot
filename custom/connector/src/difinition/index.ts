import {
    MsgSource,
    MsgQuote,
    MsgAt,
    MsgAtAll,
    MsgFace,
    MsgPlain,
    MsgImage,
    MsgFlashImage,
    MsgVoice,
    MsgXml,
    MsgJson,
    MsgApp,
    MsgPoke,
    MsgDice,
    MsgMarketFace,
    MsgMusicShare,
    MsgForwardMessage,
    MsgFile,
    MsgMiraiCode,
} from './MsgChainObj';

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
