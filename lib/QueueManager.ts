/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { QueryBuilder } from 'querybuilder-helper';
import { FilterableItem, queueFilters } from './QueueFilters';
import { Queue } from 'models/Queue';
import { Account } from 'models/Account';
import { Item } from 'models/Item';
import { QueueItem } from 'models/QueueItem';

import debugBuilder from 'debug';
const debug = debugBuilder('kitchenview:queuemanager');

/** The class responsible for managing queue updates. */
export class QueueManager {

    /** A list of all clients that are listening for updates. */
    // private connectedClients = [];

    private queryBuilder: QueryBuilder;

    constructor() {
        this.queryBuilder = new QueryBuilder();
        queueFilters.forEach(f => this.queryBuilder.registerFilter(f));
    }

    public sendToClients(queue: Queue, item: Item) {

    }

    public async handleItem(item: FilterableItem) {
        debug('Recieved new item.')
        // Get all the queues for this merchant
        const posibleQueues = await Queue.findAll({
            include: [{
                model: Account,
                where: { external_id: item.notification.merchant_id }
            }]
        });

        // Check if any match this item
        const matchingQueues = posibleQueues.filter(
            queue => this.queryBuilder.runQuery(item, JSON.parse(queue.filter))
        );

        // If we have some matches, save the item and add it to the apropriate queues.
        if(matchingQueues.length > 0) {
            const dbItem = await Item.create({
                name: item.item.name,
                quantity: item.item.quantity,
                category: item.item.item_detail.category_name,
                variation: item.item.item_variation_name,
                notes: item.item.notes,
                modifiers: item.item.modifiers.map(m => m.name).join(", "),
            });
            matchingQueues.forEach(queue => {
                QueueItem.create({
                    queueId: queue.id,
                    itemId: dbItem.id
                });
                this.sendToClients(queue, dbItem);
            });

        }
    }

}

