/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { QueryBuilder } from 'querybuilder-helper';
import { FilterableItem, queueFilters } from '../QueueFilters';
import { Queue } from '../../models/Queue';
import { Account } from '../../models/Account';
import { Item } from '../../models/Item';
import { QueueItem } from '../../models/QueueItem';

import { EventEmitter } from 'events';
import { PaymentItemization, Payment } from '../Square/Interfaces';


export class QueueManager extends EventEmitter {

    private queryBuilder: QueryBuilder;

    constructor() {
        super();

        this.queryBuilder = new QueryBuilder();
        queueFilters.forEach(f => this.queryBuilder.registerFilter(f));
    }

    public static async getQueuesForAccount(merchantId: string) {
        return Queue.findAll({
            include: [{
                model: Account,
                where: { external_id: merchantId }
            }]
        });
    }

    public static async saveItemization(payment: Payment, item: PaymentItemization) {
        return await Item.create({
            name: item.name,
            quantity: +item.quantity,
            category: item.item_detail.category_name || "",
            variation: item.item_variation_name || "",
            notes: item.notes || "",
            modifiers: item.modifiers.map(m => m.name).join(", "),
            paymentId: payment.id
        });
    }

    public async addItemToQueue(item: Item, queue: Queue) {
        await QueueItem.create({ itemId: item.id, queueId: queue.id });
        this.emit('addItem', item, queue);
    }

    public async removeItemFromQueue(itemId: number, queueId: number) {
        const queueItems = await QueueItem.findAll({ where: { itemId, queueId } });
        if (queueItems.length > 0) {
            for (const queueItem of queueItems) await queueItem.destroy();
            this.emit('removeItem', itemId, queueId);
        }
    }

    public async handleItem(purchasedItem: FilterableItem) {

        // Get all the queues for this merchant
        const posibleQueues = await QueueManager.getQueuesForAccount(purchasedItem.notification.merchant_id);

        // Check if any match this item
        const matchingQueues = posibleQueues.filter(
            queue => this.queryBuilder.runQuery(purchasedItem, JSON.parse(queue.filter))
        );

        // If we have some matches
        if (matchingQueues.length > 0) {

            // Save the item
            const item = await QueueManager.saveItemization(purchasedItem.payment, purchasedItem.item);

            // Add it to the right queues
            matchingQueues.forEach(queue => this.addItemToQueue(item, queue));

        }
    }

}

