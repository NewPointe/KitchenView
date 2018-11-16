/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Request, Response, NextFunction } from 'express';
import { Controller, Post, ParseJson } from '../lib/cp3-express-decorators';

import { QueueManager } from '../lib/app/QueueManager';
import { isNotification } from '../lib/SquareWebhook';
import { WebhookEventType } from '../lib/Square/Interfaces';
import { Account } from '../models/Account';
import { ApiClient } from '../lib/Square/ApiClient';

@Controller()
export class WebhookController {

    private queueManager: QueueManager;

    constructor(queueManager: QueueManager) {
        this.queueManager = queueManager;
    }

    @Post("/")
    @ParseJson()
    public postNotification(req: Request, res: Response, next: NextFunction) {

        // Always respond with a 200
        res.sendStatus(200);

        const body = req.body;
        console.log(body);
        if (!isNotification(body)) {
            return console.log(`Error: invalid notification body: ${body}`);
        }

        // We only care about payment updates.
        if (body.event_type !== WebhookEventType.PAYMENT_UPDATED) return;

        // Try to find a linked account
        Account.findOne({ where: { external_id: body.merchant_id } }).then(account => {

            if (!account) throw Error(`Account for merchant '${body.merchant_id}' could not be found.`);

            // Make sure we have an access token
            if (!account.auth_token) throw Error(`Account for merchant '${body.merchant_id}' has no access token.`);

            // Get the payment details so we can figure out what items they ordered
            new ApiClient(account.auth_token).getPayment(body.location_id, body.entity_id).then(
                payment => {
                    for (const itemization of payment.itemizations) {
                        this.queueManager.handleItem({
                            item: itemization,
                            payment: payment,
                            notification: body
                        })
                    }
                }
            );

        });

    }

}
