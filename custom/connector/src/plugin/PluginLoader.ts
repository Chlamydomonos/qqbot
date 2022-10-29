import app from '../app';
import fs from 'fs';
class PluginTemplate {
    httpClient = app.mclHttpClient;
    on(eventName: string, listener: (event: any, listenerData?: Record<string, any>) => void) {
        app.eventEmitter.on(eventName, listener);
        return this;
    }
    emit(eventName: string, event: any) {
        return app.eventEmitter.emit(eventName, event);
    }
}

interface PluginLoaderErrorEvent {
    error: any;
}

export const EVENT_DICT = {
    'plugin_loader:error': null as unknown as PluginLoaderErrorEvent,
};

export default class PluginLoader {
    private pluginsFileName = '';
    private allPlugins = new Map<string, any>();
    async load(pluginName: string): Promise<boolean> {
        try {
            console.log(`Loading plugin ${pluginName}...`);
            const pluginImport = await import(`@chlamydbot/${pluginName}`);
            const pluginDef = pluginImport.default.$toLoad;
            const realPlugin: any = new PluginTemplate();
            realPlugin.emits = pluginDef.emits;
            realPlugin.name = pluginDef.name;
            realPlugin.listens = pluginDef.listens;
            for (const i in pluginDef.data) {
                realPlugin[i] = pluginDef.data[i];
            }
            for (const i in pluginDef.publicMethods) {
                realPlugin[i] = pluginDef.publicMethods[i];
            }
            for (const i in pluginDef.privateMethods) {
                realPlugin[i] = pluginDef.privateMethods[i];
            }

            realPlugin.onLoad = pluginDef.onLoad;

            realPlugin.onLoad();
            this.allPlugins.set(pluginName, realPlugin);
            app.eventEmitter.emit(`${pluginName}:start`, {});
            return true;
        } catch (e) {
            console.log(`Failed to load plugin ${pluginName}`);
            app.eventEmitter.emit(`${pluginName}:error`, { error: e });
            return false;
        }
    }
    async loadAll(pluginsFileName: string) {
        this.pluginsFileName = pluginsFileName;
        return new Promise<void>((resolve) => {
            fs.readFile(pluginsFileName, async (err, data) => {
                if (err != null) {
                    app.eventEmitter.emit('plugin_loader:error', { error: err });
                    console.log('Failed to read plugin list');
                    resolve();
                    return;
                }
                if (data == null) {
                    console.log('No plugins to load');
                    resolve();
                    return;
                }
                const dataStr = data.toString();
                const names = dataStr.split('\n');
                for (let i = 0; i < names.length; i++) {
                    if (!names[i].match('/^s*$/')) {
                        await this.load(names[i]);
                    }
                }
                resolve();
                return;
            });
        });
    }

    unload(pluginName: string): boolean {
        const plugin = this.allPlugins.get(pluginName);
        if (plugin == null) {
            return false;
        }
        app.eventEmitter.emit(`${pluginName}:stop`, {});
        this.allPlugins.delete(pluginName);
        return true;
    }

    unloadAll() {
        this.allPlugins.forEach((value) => {
            const pluginName = value.name;
            console.log(`Unloading plugin ${value.name}...`);
            app.eventEmitter.emit(`${pluginName}:stop`, {});
        });
        this.allPlugins.clear();
    }

    async add(pluginName: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            fs.readFile(this.pluginsFileName, async (err, data) => {
                if (err != null) {
                    app.eventEmitter.emit('plugin_loader:error', { error: err });
                    console.log('Failed to read plugin list');
                    resolve(false);
                    return;
                }
                if (data == null) {
                    fs.writeFile(this.pluginsFileName, pluginName + '\n', async (err) => {
                        if (err != null) {
                            resolve(false);
                        }
                        try {
                            this.load(pluginName);
                        } catch (e) {
                            resolve(false);
                        }
                        resolve(true);
                        return;
                    });
                    return;
                }
                let dataStr = data.toString();
                dataStr += `${pluginName}\n`;
                fs.writeFile(this.pluginsFileName, dataStr, async (err) => {
                    if (err != null) {
                        resolve(false);
                    }
                    try {
                        this.load(pluginName);
                    } catch (e) {
                        resolve(false);
                    }
                    resolve(true);
                    return;
                });
                return;
            });
        });
    }
}
