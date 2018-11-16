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

export function isNotification(thing: any): thing is WebhookNotification {
    return "merchant_id" in thing && typeof thing.merchant_id === "string"
        && "location_id" in thing && typeof thing.location_id === "string"
        && "event_type" in thing && typeof thing.event_type === "string"
        && "entity_id" in thing && typeof thing.entity_id === "string";
}
