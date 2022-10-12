import type { PluginListGetter } from './Plugin';

export class PluginLoader {
    plugins: Map<string, any> = new Map();
    private _getPlugin(name: string) {
        const out = this.plugins.get(name);
        if (out == null) {
            throw Error(`Plugin ${name} is not loaded`);
        }
        return out;
    }

    getPlugin = this._getPlugin as unknown as PluginListGetter;
}
