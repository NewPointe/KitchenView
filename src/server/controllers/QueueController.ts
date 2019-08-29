/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Controller, Get, RequireUser, GenerateCsrf, Render, RouteParam, User, Use, AsId, Required } from '../lib/cp3-express';

import { getClientFilterOptions, getAllQueuesForUserId, getOneQueueForUserId } from '../lib/Util';
import { Account } from '../models/Account';

@Use(RequireUser)
export class QueueController extends Controller<QueueController>{

    @Get("/")
    @Render("queues")
    public async getIndex(@User() user: Account) {
        return { UserQueues: await getAllQueuesForUserId(user.id) };
    }

    @Get("/new")
    @Use(GenerateCsrf)
    @Render("queues/edit")
    public getNew() {
        return { FilterOptions: getClientFilterOptions() };
    }

    @Get("/:queueId(\\d+)/edit")
    @Use(GenerateCsrf)
    @Render("queues/edit")
    public async getEdit(
        @RouteParam("queueId") @AsId() @Required() queueId: number,
        @User() user: Account
    ) {

        return {
            Queue: await getOneQueueForUserId(user.id, queueId),
            FilterOptions: getClientFilterOptions()
        };

    }

}
