import { Attributes, Model, ModelAttributes, ModelOptions, ModelStatic, Sequelize } from 'sequelize';

const DB_DATABASE = 'qqbot';
const DB_USERNAME = 'root';
const DB_PASSWORD = '123456';
const DB_HOST = 'db';

export default class DBConnector {
    sequelize?: Sequelize;
    async start() {
        this.sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
            dialect: 'mysql',
            host: DB_HOST,
        });

        try {
            await this.sequelize.authenticate();
            console.log('Connected to db');
        } catch (e) {
            console.log('Failed to connect to db');
        }
    }

    async stop() {
        await this.sequelize?.close();
    }

    define<M extends Model<any, any>, TAttributes = Attributes<M>>(
        modelName: string,
        attributes: ModelAttributes<M, TAttributes>
    ): ModelStatic<M> {
        if (this.sequelize == null) {
            throw Error('DB not started');
        }

        return this.sequelize.define(modelName, attributes, { freezeTableName: true });
    }
}
