/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Response, NextFunction } from 'express';
import { Controller, Get, RequireUser, GenerateCsrf } from '../lib/cp3-express-decorators';

import { getClientFilterOptions, getAllQueuesForUserId, getOneQueueForUserId } from '../lib/Util';
import { Request } from '../lib/app/App';

@Controller()
@RequireUser()
export class QueueController {

    @Get("/")
    public getIndex(req: Request, res: Response, next: NextFunction) {

        getAllQueuesForUserId(req.user.id).then(
            UserQueues => res.render('queues', { UserQueues })
        ).catch(next);

    }

    @Get("/new")
    @GenerateCsrf()
    public getNew(req: Request, res: Response, next: NextFunction) {

        res.render('queues/edit', { FilterOptions: getClientFilterOptions() });

    }

    @Get("/:id/edit")
    @GenerateCsrf()
    public getEdit(req: Request<{ id: string }>, res: Response, next: NextFunction) {

        const queueId = +(req.params["id"] || 0);
        getOneQueueForUserId(req.user.id, queueId).then(
            Queue => res.render('queues/edit', { Queue, FilterOptions: getClientFilterOptions() })
        ).catch(next);

    }

}
