import type { IGlobalEventEmitter } from '../event/GlobalEventEmitter';
import GlobalEventEmitter from '../event/GlobalEventEmitter';
import { MCL_WS_URL, QQ, VERIFY_KEY } from '../mcl_definition';
import PluginLoader from '../plugin/PluginLoader';
import ControlServer from './control/ControlServer';
import type { HTTPClient } from './mcl/HTTPClient';
import MclHTTPClient from './mcl/HTTPClient';
import MclWSClient from './mcl/WSClient';

const APP_FILES_ROOT = '/app/files';

export class App {
    mclWsClient: MclWSClient;
    mclHttpClient: HTTPClient = MclHTTPClient;
    eventEmitter: GlobalEventEmitter;
    pluginLoader: PluginLoader;
    controlServer: ControlServer;
    constructor() {
        this.mclWsClient = new MclWSClient(MCL_WS_URL);
        this.eventEmitter = new GlobalEventEmitter();
        this.pluginLoader = new PluginLoader();
        this.controlServer = new ControlServer();
    }

    async start() {
        console.log('Starting global event emitter...');
        this.eventEmitter.start();

        console.log('Starting control server...');
        this.controlServer.start();

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
        } catch (e) {
            console.log(`Start mcl http client failed: ${e}`);
            this.stop();
        }

        console.log('Loading plugins...');
        await this.pluginLoader.loadAll(`${APP_FILES_ROOT}/plugin.txt`);
    }

    async stop() {
        console.log('Unloading plugins...');
        await this.pluginLoader.unloadAll();

        console.log('Stopping mcl http client...');
        this.mclHttpClient.send('/release', { sessionKey: this.mclHttpClient.sessionKey, qq: parseInt(QQ) });

        console.log('Stopping mcl ws client...');
        this.mclWsClient.stop();

        console.log('Stopping control server...');
        this.controlServer.stop();
    }
}

export default new App();
