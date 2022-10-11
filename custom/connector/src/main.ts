import { WS_URL } from './definition/request/ws';
import WSClient from './ws/WSClient';

const wsClient = new WSClient(WS_URL);
wsClient.start();
