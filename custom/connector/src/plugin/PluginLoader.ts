import app from '../app';
import fs from 'fs';
import type { Attributes, Model, ModelAttributes, ModelStatic } from 'sequelize';

class PluginDB {
    constructor(public plugin: any) {}
    define<M extends Model<any, any>, TAttributes = Attributes<M>>(
        modelName: string,
        attributes: ModelAttributes<M, TAttributes>
    ): ModelStatic<M> {
        return app.dbConnector.define(`${this.plugin.name}\$${modelName}`, attributes);
    }
}
class PluginTemplate {
    httpClient = app.mclHttpClient;
    db = new PluginDB(this);
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
                    if (!names[i].match(/^s*$/)) {
                        await this.load(names[i]);
                    }
                }
                resolve();
                return;
            });
        });
    }

    unloadAll() {
        this.allPlugins.forEach((value) => {
            const pluginName = value.name;
            console.log(`Unloading plugin ${value.name}...`);
            app.eventEmitter.emit(`${pluginName}:stop`, {});
        });
        this.allPlugins.clear();
    }

    async add(pluginName: string) {
        return new Promise<boolean>((resolve) => {
            fs.readFile(this.pluginsFileName, async (err, data) => {
                if (err != null) {
                    app.eventEmitter.emit('plugin_loader:error', { error: err });
                    console.log('Failed to read plugin list');
                    resolve(false);
                    return;
                }
                let dataStr: string;
                if (data == null) {
                    dataStr = '';
                } else {
                    dataStr = data.toString();
                }
                dataStr += `${pluginName}\n`;
                fs.writeFile(this.pluginsFileName, dataStr, (err) => {
                    if (err != null) {
                        app.eventEmitter.emit('plugin_loader:error', { error: err });
                        console.log(`Failed to write plugin list`);
                        resolve(false);
                        return;
                    }
                });
                resolve(true);
                return;
            });
        });
    }

    async remove(pluginName: string) {
        return new Promise<boolean>((resolve) => {
            fs.readFile(this.pluginsFileName, async (err, data) => {
                if (err != null) {
                    app.eventEmitter.emit('plugin_loader:error', { error: err });
                    console.log('Failed to read plugin list');
                    resolve(false);
                    return;
                }
                let dataStr: string;
                if (data == null) {
                    dataStr = '';
                } else {
                    dataStr = data.toString();
                }

                const names = new Set(...dataStr.split('\n'));
                names.delete(pluginName);
                dataStr = '';
                names.forEach((name) => {
                    dataStr += `${name}\n`;
                });

                fs.writeFile(this.pluginsFileName, dataStr, (err) => {
                    if (err != null) {
                        app.eventEmitter.emit('plugin_loader:error', { error: err });
                        console.log(`Failed to write plugin list`);
                        resolve(false);
                        return;
                    }
                });
                resolve(true);
                return;
            });
        });
    }

    async list() {
        return new Promise<string[]>((resolve, reject) => {
            fs.readFile(this.pluginsFileName, async (err, data) => {
                if (err != null) {
                    app.eventEmitter.emit('plugin_loader:error', { error: err });
                    console.log('Failed to read plugin list');
                    reject(err);
                    return;
                }
                let dataStr: string;
                if (data == null) {
                    dataStr = '';
                } else {
                    dataStr = data.toString();
                }

                resolve(dataStr.split('\n'));
                return;
            });
        });
    }

    listLoaded() {
        return [...this.allPlugins.keys()];
    }
}
