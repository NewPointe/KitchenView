/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Request, Response, NextFunction } from 'express';
import { Controller, Get, RequireUser, GenerateCsrf } from '../lib/cp3-express-decorators';

import { getClientFilterOptions, getAllQueuesForUser, getOneQueueForUser } from '../lib/Util';

@Controller()
@RequireUser()
export class QueueController {

    @Get("/")
    public getIndex(req: Request, res: Response, next: NextFunction) {

        getAllQueuesForUser(req.user).then(
            UserQueues => res.render('queues', { UserQueues })
        );

    }

    @Get("/new")
    @GenerateCsrf()
    public getNew(req: Request, res: Response, next: NextFunction) {

        res.render('queues/edit', { FilterOptions: getClientFilterOptions() });
        
    }

    @Get("/:id")
    public getOne(req: Request, res: Response, next: NextFunction) {

        const queueId = +req.params["id"];
        getOneQueueForUser(req.user, queueId).then(
            Queue => res.render('queues/watch', { Queue })
        );
        
    }

    @Get("/:id/edit")
    @GenerateCsrf()
    public getEdit(req: Request, res: Response, next: NextFunction) {

        const queueId = +req.params["id"];
        getOneQueueForUser(req.user, queueId).then(
            Queue => res.render('queues/edit', { Queue, FilterOptions: getClientFilterOptions() })
        );
        
    }

}
