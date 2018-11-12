/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Express } from 'express';
import processCookies from 'cookie-parser';

export class CookieManager {

    private app: Express;

    constructor(app: Express, cookieSecret: string) {
        this.app = app;
        this.app.use(processCookies(cookieSecret));
    }

}
