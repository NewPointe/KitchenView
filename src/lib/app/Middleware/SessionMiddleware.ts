/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import processSession, { Store } from 'express-session';
import createSequelizeStore = require('connect-session-sequelize');
const SequelizeStore = createSequelizeStore(Store);


import { DatabaseManager } from '../DatabaseManager';
import { Middleware } from './Middleware';

export class SessionMiddleware extends Middleware {

    constructor(sessionSecret: string, dbManager: DatabaseManager) {

        super(
            processSession({
                cookie: {
                    httpOnly: true,
                    secure: true,
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
