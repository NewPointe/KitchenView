/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { randomBytes } from 'crypto';

import base64url from 'base64url';
import { Controller, Post, Delete, RequireUser, ValidateCsrf, ParseJson, Use, User, RenderJSON, AsInt, Required } from '../../lib/cp3-express';

import { Queue } from '../../models/Queue';
import { Screen } from '../../models/Screen';
import { Param } from '../../lib/cp3-express';
import { getOneQueueForUserId } from '../../lib/Util';
import { Account } from '../../models/Account';

@Use(RequireUser)
export class ScreenApiController extends Controller<ScreenApiController> {

    @Post("/")
    @Use(ParseJson)
    @Use(ValidateCsrf)
    @RenderJSON()
    public async create(
        @Param("queueId") @AsInt() @Required() queueId: string,
        @User() @Required() user: Account
    ) {

        const queue = await getOneQueueForUserId(user.id, +(queueId || 0));

        return await Screen.create({
            queueId: queue.id,
            viewKey: base64url.encode(randomBytes(16)),
            viewSecret: base64url.encode(randomBytes(16))
        });

    }

    @Delete("/:screenId")
    @RenderJSON()
    public async deleteOne(
        @Param("screenId") @AsInt() @Required() screenId: number,
        @User() @Required() user: Account
    ) {

        const screen = await Screen.findOne({
            where: { id: screenId },
            include: [Queue],
            rejectOnEmpty: true
        });

        if(screen.queue.accountId === user.id) {
            await screen.destroy();
            return;
        }
        else {
            return null;
        }

    }
}
