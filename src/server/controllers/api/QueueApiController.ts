/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import httpError from 'http-errors';

import { Controller, Get, Post, Delete, RequireUser, ValidateCsrf, ParseJson, Use, Body, RouteParam, User, RenderJSON, AsId, Required, BodyParam } from '../../lib/cp3-express';

import { getAllQueuesForUserId, getOneQueueForUserId } from '../../lib/Util';
import { Queue } from '../../models/Queue';
import { Account } from '../../models/Account';

interface IQueue {
    crfToken?: string;
    id?: number | string;
    name: string;
    filter: string;
}

// tslint:disable:no-unsafe-any
function checkQueue(queue: any): queue is IQueue {
    return (!("id" in queue) || typeof queue.name === 'number' || typeof queue.name === 'string')
        && "name" in queue && typeof queue.name === 'string'
        && "filter" in queue && typeof queue.filter === 'string';
}
// tslint:enable

function queueToJson(queue: Queue) {
    return { id: queue.id, name: queue.name, filter: queue.filter };
}

@Use(RequireUser)
export class QueueApiController extends Controller<QueueApiController> {

    @Get("/")
    @RenderJSON()
    public async getIndex(
        @User() user: Account
    ) {

        return (await getAllQueuesForUserId(user.id)).map(queueToJson);

    }

    @Post("/")
    @Post("/:queueId(\\d+)")
    @Use(ParseJson)
    @Use(ValidateCsrf)
    @RenderJSON()
    public async createOrEdit(
        @RouteParam("queueId") @AsId({ default: null }) queueId: number | null,
        @BodyParam("queueId") @AsId({ default: null }) altQueueId: number | null,
        @Body() newQueue: Partial<IQueue>,
        @User() user: Account
    ) {

        if (!checkQueue(newQueue)) throw new httpError.BadRequest("Queue must have a 'name' and 'filter'.");

        const existingQueueId = queueId || altQueueId;

        if (existingQueueId == null) {

            const updatedQueue = await Queue.create({
                name: newQueue.name,
                filter: newQueue.filter,
                accountId: user.id
            });

            return queueToJson(updatedQueue);

        }
        else {

            const existingQueue = await getOneQueueForUserId(user.id, existingQueueId);

            const updatedQueue = await existingQueue.update({ name: newQueue.name, filter: newQueue.filter });

            return queueToJson(updatedQueue);

        }

    }

    @Get("/:queueId(\\d+)")
    @RenderJSON()
    public async getOne (
        @RouteParam("queueId") @AsId() @Required() queueId: number,
        @User() user: Account
    ) {

        var queue = await getOneQueueForUserId(user.id, queueId);

        return { id: queue.id, name: queue.name, filter: queue.filter };

    }

    @Delete("/:queueId(\\d+)")
    @RenderJSON()
    public async deleteOne(
        @RouteParam("queueId") @AsId() @Required() queueId: number,
        @User() user: Account
    ) {

        var queue = await getOneQueueForUserId(user.id, queueId);

        await queue.destroy();

    }

}
