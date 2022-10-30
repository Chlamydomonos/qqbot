import app from '..';

export default class PluginController {
    start() {
        app.eventEmitter.on('control_server:data', async (event, listenerData) => {
            const data = event.data as string;
            if (!listenerData.core) {
                listenerData.core = { read: true };
            }

            const add = data.match(/^\s*addPlugin\s+([a-z]+)\s*$/);
            if (add) {
                listenerData.core.addingPlugin = true;
                const pluginName = add[1];
                const result = await app.pluginLoader.add(pluginName);
                if (result) {
                    event.socket.write(`Successfully added plugin ${pluginName}`);
                    console.log(`Added plugin ${pluginName}. Restarting...`);
                    app.stop();
                } else {
                    event.socket.write(`Failed to add plugin ${pluginName}`);
                    console.log(`Failed to add plugin ${pluginName}`);
                }
            }

            const remove = data.match(/^\s*removePlugin\s+([a-z]+)\s*$/);
            if (remove) {
                listenerData.core.removingPlugin = true;
                const pluginName = remove[1];
                const result = await app.pluginLoader.remove(pluginName);
                if (result) {
                    event.socket.write(`Successfully removed plugin ${pluginName}`);
                    console.log(`Removed plugin ${pluginName}. Restarting...`);
                    app.stop();
                } else {
                    event.socket.write(`Failed to remove plugin ${pluginName}`);
                    console.log(`Failed to remove plugin ${pluginName}`);
                }
            }

            const list = data.match(/^\s*listPlugins\s*$/);
            if (list) {
                listenerData.core.listingPlugins = true;
                try {
                    const result = await app.pluginLoader.list();
                    event.socket.write(`plugins:${JSON.stringify(result)}`);
                } catch (e) {
                    event.socket.write('Cannot list plugins');
                }
            }

            const listLoaded = data.match(/^\s*listLoadedPlugins\s*$/);
            if (listLoaded) {
                listenerData.core.listingLoadedPlugins = true;
                event.socket.write(`plugins:${JSON.stringify(app.pluginLoader.listLoaded())}`);
            }

            return;
        });
    }
}
