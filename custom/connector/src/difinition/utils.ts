export interface User {
    id: number;
    nickname: string;
    remark: string;
}

export interface Group {
    id: number;
    name: string;
    permission: string;
}

export interface GroupMember {
    id: number;
    memberName: string;
    specialTitle: string;
    permission: string;
    joinTimestamp: number;
    lastSpeakTimestamp: number;
    muteTimeRemaining: number;
    group: Group;
}
