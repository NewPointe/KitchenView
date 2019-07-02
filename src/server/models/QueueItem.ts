/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Queue } from './Queue';
import { Item } from './Item';

/**
 * A queue.
 */
@Table
export class QueueItem extends Model<QueueItem> {

    id!: number;

    /** The Queue Id. */
    @ForeignKey(() => Queue)
    @Column
    public queueId!: number;

    /** The Queue. */
    @BelongsTo(() => Queue)
    public queue!: Queue;

    /** The Item Id. */
    @ForeignKey(() => Item)
    @Column
    public itemId!: number;

    /** The Developer. */
    @BelongsTo(() => Item)
    public item!: Item;

    /** The Date/Time the Item was cleared from the Queue. */
    @Column
    public clearedAt!: Date;


}
