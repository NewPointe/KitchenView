/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Express } from 'express';
import processSessions from "express-session";
import createSequelizeStore = require("connect-session-sequelize");
const SequelizeStore = createSequelizeStore(processSessions.Store);


import { DatabaseManager } from "./DatabaseManager";

export class SessionManager {

    private app: Express;

    constructor(app: Express, sessionSecret: string, dbManager: DatabaseManager) {
        this.app = app;
        this.app.use(
            processSessions({
                cookie: {
                    // httpOnly: true,
                    // secure: true,
                    sameSite: 'lax',
                },
                secret: sessionSecret,
                store: new SequelizeStore({ db: dbManager.sequelize }),
                resave: false,
                proxy: true,
                saveUninitialized: true,
            })
        );
    }

}
