import type { IGlobalEventEmitter } from '../event/GlobalEventEmitter';
import GlobalEventEmitter from '../event/GlobalEventEmitter';
import { MCL_WS_URL, QQ, VERIFY_KEY } from '../mcl_definition';
import PluginLoader from '../plugin/PluginLoader';
import type { HTTPClient } from './mcl/HTTPClient';
import MclHTTPClient from './mcl/HTTPClient';
import MclWSClient from './mcl/WSClient';

const APP_FILES_ROOT = '/app/files';

export class App {
    mclWsClient: MclWSClient;
    mclHttpClient: HTTPClient = MclHTTPClient;
    eventEmitter: IGlobalEventEmitter;
    pluginLoader: PluginLoader;
    constructor() {
        this.mclWsClient = new MclWSClient(MCL_WS_URL);
        this.eventEmitter = new GlobalEventEmitter();
        this.pluginLoader = new PluginLoader();
    }

    async start() {
        console.log('Starting mcl ws client...');
        this.mclWsClient.start();

        console.log('Starting mcl http client...');
        try {
            const verifyRes = await this.mclHttpClient.send('/verify', { verifyKey: VERIFY_KEY });
            if (verifyRes.code != 0) {
                throw new Error(`Verify response code is ${verifyRes.code}: ${verifyRes.msg}`);
            }
            const bindRes = await this.mclHttpClient.send('/bind', {
                sessionKey: verifyRes.session,
                qq: parseInt(QQ),
            });
            if (bindRes.code != 0) {
                throw new Error(`Bind response data is ${bindRes.code}: ${bindRes.msg}`);
            }
            this.mclHttpClient.sessionKey = verifyRes.session;

            console.log('Loading plugins...');
            await this.pluginLoader.loadAll(`${APP_FILES_ROOT}/plugin.txt`);
        } catch (e) {
            console.log(`Start mcl http client failed: ${e}`);
            throw e;
        }
    }

    async stop() {
        console.log('Stopping mcl http client...');
        this.mclHttpClient.send('/release', { sessionKey: this.mclHttpClient.sessionKey, qq: parseInt(QQ) });

        console.log('Stopping mcl ws client...');
        this.mclWsClient.stop();
    }
}

export default new App();
