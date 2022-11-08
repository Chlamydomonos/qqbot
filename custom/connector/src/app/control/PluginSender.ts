import app from '..';

export default class PluginSender {
    start() {
        app.eventEmitter.on('control_server:data', (event, listenerData) => {
            const data = event.data as string;
            if (!listenerData.core) {
                listenerData.core = { read: true };
            }
            const matchResult = data.match(/^\s*toPlugin\s+([a-z]+)\s+(.+)$/);
            if (matchResult) {
                listenerData.core.sendingToPlugin = true;
                const pluginName = matchResult[0];
                let pluginData: any = null;
                try {
                    pluginData = JSON.parse(matchResult[1]);
                    app.eventEmitter.emit(`${pluginName}:request`, { data: pluginData });
                } catch (e) {
                    app.eventEmitter.emit(`${pluginName}:error_request`, {});
                }
            }
        });
    }
}
