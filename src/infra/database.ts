import pgPromise from "pg-promise";
import {IMain, IDatabase} from "pg-promise";

const connection: any = {
    user: 'postgres',
    password: 'secret',
    host: 'localhost',
    port: 25432,
    database: 'ccca_15',
}

const pgp: IMain = pgPromise();
const db: IDatabase<any> = pgp(connection);

export {
    db
};