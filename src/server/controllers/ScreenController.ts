/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import httpError from 'http-errors';
import { Response, NextFunction } from 'express';
import { Controller, Get, RequireUser, GenerateCsrf } from '../lib/cp3-express-decorators';

import { Queue } from '../models/Queue';
import { Screen } from '../models/Screen';
import { Request } from '../lib/app/App';

@Controller()
@RequireUser()
export class ScreenController {

    @Get("/")
    @GenerateCsrf()
    public getOne(req: Request<{ queueId: string }, { queueId: string }>, res: Response, next: NextFunction) {

        const queueId = +(req.params["queueId"] || 0) || +(req.query["queueId"] || 0);
        Queue.findOne({
            where: {
                id: queueId,
                accountId: req.user.id
            },
            include: [Screen]
        }).then(
            queue => {
                if(queue !== null) res.render('screens/index', { Queue: queue });
                else next(new httpError.NotFound());
            }
        ).catch(next);

    }

}
