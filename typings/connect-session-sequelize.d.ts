/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Store } from 'express-session';
import { Sequelize, Model } from "sequelize";

declare interface IFieldDefaults {
    data: string;
    expires: Date;
    [column: string]: {};
}

declare interface ISequelizeStoreOptions {
    db: Sequelize;
    checkExpirationInterval?: number;
    expiration?: number;
    disableTouch?: boolean;
    table?: Model<{}, {}>;
    extendDefaultFields?(defaultFields: IFieldDefaults, session: Express.SessionData): IFieldDefaults;
}

/** The SequelizeStore */
declare class SequelizeStore extends Store {

    constructor(options: ISequelizeStoreOptions);

    /** Syncs the session table */
    public sync(): void;

    /** Clears expires sessions */
    public clearExpiredSessions(callback: () => {}): void;

    /** Stops the automattic clearing of expired sessions */
    public startExpiringSessions(): void;

    /** Starts the automattic clearing of expired sessions */
    public stopExpiringSessions(): void;
}

/** Creates a new SequelizeStore class */
declare function SequelizeSessionInit(store: typeof Store): typeof SequelizeStore;

export = SequelizeSessionInit;