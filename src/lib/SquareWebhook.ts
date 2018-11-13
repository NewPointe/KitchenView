/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { createHmac, timingSafeEqual } from 'crypto';

import { Request, Response } from 'express';

import { WebhookNotification, WebhookEventType } from './Square/Interfaces';
import { Account } from '../models/Account';
import { ApiClient } from './Square/ApiClient';

export function validateWebhook(webhookUrl: string, webhookSignatureKey: string, req: Request) {
    const squareSignature = req.header('X-Square-Signature');
    if (!squareSignature) throw new Error("Request is missing Square Signature header.");

    const requestBody = (req as any).rawBody as string;
    if (!requestBody) throw new Error("Could not get raw body.");

    const hmac = createHmac('sha1', webhookSignatureKey);
    hmac.update(webhookUrl);
    hmac.update(requestBody);
    const webhookSignature = hmac.digest('base64');

    if (!timingSafeEqual(Buffer.from(squareSignature), Buffer.from(webhookSignature))) {
        throw new Error("Signatures do not match.");
    }
    else {
        return true;
    }
}

export async function processWebhook(req: Request, res: Response) {

    // Always respond with a 200
    res.sendStatus(200);

    // Make sure the body is valid
    if(!isNotification(req.body)) throw new Error("Body in unexpected format.");
    
    const notification = req.body;

    // We only care about payment updates.
    if(notification.event_type !== WebhookEventType.PAYMENT_UPDATED) return; 

    // Try to find a linked account
    const account = await Account.findOne({ where: { external_id: notification.merchant_id } });
    if(!account) throw Error(`Account for merchant '${notification.merchant_id}' could not be found.`);

    // Make sure we have an access token
    if(!account.auth_token) throw Error(`Account for merchant '${notification.merchant_id}' has no access token.`);

    // Get the payment details so we can figure out what items they ordered
    new ApiClient(account.auth_token).getPayment(notification.location_id, notification.entity_id).then(
        payment => {
            
        }
    )

}

function isNotification(thing: any): thing is WebhookNotification {
    return "merchant_id" in thing && typeof thing.merchant_id === "string"
        && "location_id" in thing && typeof thing.location_id === "string"
        && "event_type" in thing && typeof thing.event_type === "string"
        && "entity_id" in thing && typeof thing.entity_id === "string";
}
