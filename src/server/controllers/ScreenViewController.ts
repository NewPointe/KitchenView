/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { timingSafeEqual } from 'crypto';

import httpError from 'http-errors';
import { Response, NextFunction } from 'express';
import { Controller, Get } from '../lib/cp3-express-decorators';

import { Screen } from '../models/Screen';
import { Queue } from '../models/Queue';
import { Request } from '../lib/app/App';

@Controller()
export class ScreenViewController {

    @Get("/:key/:secret")
    public getOne(req: Request<{ key: string, secret: string }>, res: Response, next: NextFunction) {

        const screenKey = req.params["key"] || "";
        const screenSecret = req.params["secret"] || "";

        Screen.findOne({
            where: {
                viewKey: screenKey
            },
            include: [Queue]
        }).then(
            screen => {
                if(screen) {
                    if(timingSafeEqual(Buffer.from(screen.viewSecret, 'utf8'), Buffer.from(screenSecret, 'utf8'))) {
                        res.render('queues/watch', { Queue: screen.queue, ViewKey: screenKey, ViewSecret: screenSecret });
                    }
                    else next(new httpError.Unauthorized());
                }
                else next(new httpError.NotFound());
            }
        ).catch(next);

    }

}
