/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, AllowNull, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Queue } from './Queue';
import { QueueItem } from './QueueItem';

/**
 * An item.
 */
@Table({
    timestamps: true
})
export class Item extends Model<Item> {

    /** The Item Name */
    @AllowNull(false)
    @Column(Sequelize.STRING(255))
    public name!: string;

    /** The Item Variation */
    @AllowNull(true)
    @Column(Sequelize.STRING(255))
    public variation!: string;

    /** The Item Category */
    @AllowNull(true)
    @Column(Sequelize.STRING(255))
    public category!: string;

    /** The Item Quantity */
    @AllowNull(false)
    @Column(Sequelize.INTEGER)
    public quantity!: number;

    /** The Item Note */
    @AllowNull(true)
    @Column(Sequelize.TEXT)
    public notes!: string;

    /** The Item Modifiers */
    @AllowNull(true)
    @Column(Sequelize.TEXT)
    public modifiers!: string;

    /** The QueuesItems. */
    @HasMany(() => QueueItem)
    public queueItems!: QueueItem[];

    /** The Queues this Item is in. */
    @BelongsToMany(() => Queue, () => QueueItem)
    public queues!: Queue[];

    /** The payment the item is from. */
    @Column(Sequelize.STRING(255))
    public paymentId!: string;

}
