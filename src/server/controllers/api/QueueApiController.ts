/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Response, NextFunction } from 'express';
import { Controller, Get, Post, Delete, RequireUser, ValidateCsrf, ParseJson } from '../../lib/cp3-express-decorators';

import { getAllQueuesForUserId, getOneQueueForUserId } from '../../lib/Util';
import { Queue } from '../../models/Queue';
import { Request } from '../../lib/app/App';

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

@Controller()
@RequireUser()
export class QueueApiController {

    @Get("/")
    public getIndex(req: Request, res: Response, next: NextFunction) {

        getAllQueuesForUserId(req.user.id).then(
            queues => res.json(queues.map(queueToJson))
        ).catch(
            (err: Error) => res.status(500).json({ message: err.message })
        );

    }

    @Post("/")
    @Post("/:id")
    @ParseJson()
    @ValidateCsrf()
    public createOrEdit(req: Request<{ id: string }, never, Queue>, res: Response, next: NextFunction) {

        const newQueue = req.body;
        if (!checkQueue(newQueue)) res.status(400).json({ message: "Queue must have a 'name' and 'filter'." });

        const queueId = req.params["id"] || newQueue.id;
        if(typeof queueId !== 'undefined' ) {
            getOneQueueForUserId(req.user.id, +queueId).then(
                queue => {
                    if (queue) {
                        queue.update({ name: newQueue.name, filter: newQueue.filter }).then(
                            () => res.status(204).send(),
                            (err: Error) => res.status(500).json({ message: err.message })
                        );
                    }
                    else res.status(404).json({ message: "That Queue does not exist." });
                },
                (err: Error) => res.status(500).json({ message: err.message })
            );
        }
        else {
            Queue.create({
                name: newQueue.name,
                filter: newQueue.filter,
                accountId: req.user.id
            }).then(
                queue => res.status(200).json(queueToJson(queue)),
                (err: Error) => res.status(500).json({ message: err.message })
            );
        }

    }

    @Get("/:id")
    public getOne(req: Request<{ id: string }>, res: Response, next: NextFunction) {

        const queueId = +(req.params["id"] || 0);
        getOneQueueForUserId(req.user.id, queueId).then(
            queue => {
                if (queue) res.status(200).json({ id: queue.id, name: queue.name, filter: queue.filter });
                else res.status(404).json({ message: "That Queue does not exist." });
            }
        ).catch(
            (err: Error) => res.status(500).json({ message: err.message })
        );

    }

    @Delete("/:id")
    public deleteOne(req: Request<{ id: string }>, res: Response, next: NextFunction) {

        const queueId = +(req.params["id"] || 0);
        getOneQueueForUserId(req.user.id, queueId).then(
            queue => {
                if (queue) {
                    queue.destroy().then(
                        () => res.status(204).send(),
                        (err: Error) => res.status(500).json({ message: err.message })
                    );
                }
                else res.status(404).json({ message: "That Queue does not exist." });
            }
        ).catch(
            (err: Error) => res.status(500).json({ message: err.message })
        );

    }

}
