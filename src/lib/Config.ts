/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import * as path from 'path';

export interface IConfig {
    web: {
        domain: string,
        port: number,
        cookieSecret: string
    },
    db: {
        dialect: string,
        host: string,
        port: number,
        database: string,
        username: string,
        password: string
    },
    oauth: {
        authorizationURL: string,
        tokenURL: string,
        scope: string,
        scopeSeparator: string,
        grant_type: string,
        clientID: string,
        clientSecret: string,
        callbackURL: string
    },
    webhook: {
        signatureKey: string
    }
}

export function getConfig(): IConfig {
    return require(path.join(process.cwd(), 'config.json'));
}
