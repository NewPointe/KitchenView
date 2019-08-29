/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Controller, Get, RequireUser, GenerateCsrf, Use, Param, User, Render, AsId, Required } from '../lib/cp3-express';

import { Queue } from '../models/Queue';
import { Screen } from '../models/Screen';
import { Account } from '../models/Account';

@Use(RequireUser)
export class ScreenController extends Controller<ScreenController> {

    @Get("/")
    @Use(GenerateCsrf)
    @Render("screens/index")
    public async getOne(
        @Param("queueId") @AsId() @Required() queueId: number,
        @User() user: Account
    ) {

        return {
            Queue: await Queue.findOne({
                where: {
                    id: queueId,
                    accountId: user.id
                },
                include: [Screen],
                rejectOnEmpty: true
            })
        };

    }

}
