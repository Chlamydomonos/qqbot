import type { Event } from '../../event';

const HOST = 'mcl';
const PORT = '8765';
const VERIFY_KEY = 'CHLAMYDOMONOS';
const QQ = '2472884021';

export interface WsEvent {
    syncId: number;
    data: Event;
}

export const WS_URL = `ws://${HOST}:${PORT}/all?verifyKey=${VERIFY_KEY}&qq=${QQ}`;
