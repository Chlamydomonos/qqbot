import { WS_URL } from './definition/connect';
import WSClient from './ws/WSClient';

const wsClient = new WSClient(WS_URL);
wsClient.start();
