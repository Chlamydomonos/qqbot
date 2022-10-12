import { MCL_WS_URL } from './mcl_definition';
import WSClient from './app/mcl/WSClient';

const wsClient = new WSClient(MCL_WS_URL);
wsClient.start();
