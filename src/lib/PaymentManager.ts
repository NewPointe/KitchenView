/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { WebhookNotification, Payment } from "./Square/Interfaces";
import { QueueManager } from "./app/QueueManager";

'use strict';

/** The class responsible for managing payments and sending new items to the Queue Manager. */
export class PaymentManager {

    constructor(private queueManager: QueueManager) {}

    public handlePayment(notification: WebhookNotification, payment: Payment) {
        if('itemizations' in payment && Array.isArray(payment.itemizations))
            payment.itemizations.forEach(item => this.queueManager.handleItem({ notification, payment, item }));
    }

}

