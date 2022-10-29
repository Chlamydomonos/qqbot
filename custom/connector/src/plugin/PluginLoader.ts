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

export default class PluginLoader {
    private allPlugins = new Set<any>();
    async load(pluginName: string) {
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
            this.allPlugins.add(realPlugin);
            app.eventEmitter.emit(`${pluginName}:start`, {});
        } catch (e) {
            console.log(`Failed to load plugin ${pluginName}`);
            app.eventEmitter.emit(`${pluginName}:error`, { error: e });
        }
    }
    async loadAll(pluginsFileName: string) {
        return new Promise<void>((resolve, reject) => {
            fs.readFile(pluginsFileName, async (err, data) => {
                if (err != null) {
                    reject(new Error('Cannot read plugin list'));
                }
                const dataStr = data.toString();
                const names = dataStr.split('\n');
                for (let i = 0; i < names.length; i++) {
                    await this.load(names[i]);
                }
                resolve();
            });
        });
    }
    unloadAll() {
        this.allPlugins.forEach((value) => {
            const pluginName = value.name;
            app.eventEmitter.emit(`${pluginName}:stop`, {});
        });
        this.allPlugins.clear();
    }
}
