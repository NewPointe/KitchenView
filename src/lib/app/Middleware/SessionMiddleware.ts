/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RequestHandler } from 'express';
import processSession from "express-session";
import createSequelizeStore = require("connect-session-sequelize");
const SequelizeStore = createSequelizeStore(processSession.Store);


import { DatabaseManager } from "../DatabaseManager";

export class SessionMiddleware {

    private _process: RequestHandler;
    public get process() {
        return this._process;
    }

    constructor(sessionSecret: string, dbManager: DatabaseManager) {
        
        this._process = processSession({
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
        });
        
    }

}
