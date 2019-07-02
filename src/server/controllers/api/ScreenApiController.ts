/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { randomBytes } from 'crypto';

import base64url from 'base64url';
import { Response, NextFunction } from 'express';
import { Controller, Post, Delete, RequireUser, ValidateCsrf, ParseJson } from '../../lib/cp3-express-decorators';

import { Queue } from '../../models/Queue';
import { Screen } from '../../models/Screen';
import { Request } from '../../lib/app/App';

@Controller()
@RequireUser()
export class ScreenApiController {

    @Post("/")
    @ParseJson()
    @ValidateCsrf()
    public create(req: Request<{ queueId: string }, { queueId: string }, { queueId: string }>, res: Response, next: NextFunction) {

        const queueId = +(req.params["queueId"] || req.query["queueId"] || req.body["queueId"] || 0);
        Queue.findOne({
            where: {
                id: queueId,
                accountId: req.user.id
            }
        }).then(
            queue => {
                if (queue) {
                    Screen.create({
                        queueId: queue.id,
                        viewKey: base64url.encode(randomBytes(16)),
                        viewSecret: base64url.encode(randomBytes(16))
                    }).then(
                        screen => res.status(204).send()
                    ).catch(
                        (err: Error) => res.status(500).json({ message: err.message })
                    );
                }
                else res.status(404).json({ message: "That Queue does not exist." });
            }
        ).catch(
            (err: Error) => res.status(500).json({ message: err.message })
        );

    }

    @Delete("/:screenId")
    public deleteOne(req: Request<{ screenId: string }>, res: Response, next: NextFunction) {

        const screenId = +(req.params["screenId"] || 0);
        Screen.findOne({
            where: { id: screenId },
            include: [Queue]
        }).then(
            screen => {
                if (screen && screen.queue.accountId === req.user.id) {
                    screen.destroy().then(
                        () => res.status(204).send(),
                        (err: Error) => res.status(500).json({ message: err.message })
                    );
                }
                else res.status(404).json({ message: "That Screen does not exist." });
            }
        ).catch(
            (err: Error) => res.status(500).json({ message: err.message })
        );

    }
}
