/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { timingSafeEqual } from 'crypto';

import httpError from 'http-errors';

import { Controller, Get, RouteParam, Render } from '../lib/cp3-express';

import { Screen } from '../models/Screen';
import { Queue } from '../models/Queue';

export class ScreenViewController extends Controller<ScreenViewController> {

    @Get("/:key/:secret")
    @Render("queues/watch")
    public async getOne(
        @RouteParam("key") key: string,
        @RouteParam("secret") secret: string
    ) {

        const screen = await Screen.findOne({
            where: {
                viewKey: key
            },
            include: [Queue],
            rejectOnEmpty: true
        });

        if(timingSafeEqual(Buffer.from(screen.viewSecret, 'utf8'), Buffer.from(secret, 'utf8'))) {
            return { Queue: screen.queue, ViewKey: key, ViewSecret: secret };
        }
        else throw new httpError.Unauthorized();

    }

}
