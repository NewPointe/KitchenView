/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { STRING } from 'sequelize';
import { Table, Column, Model, BelongsTo, ForeignKey, NotEmpty, NotNull, Unique } from 'sequelize-typescript';
import { Queue } from './Queue';

/**
 * A queue.
 */
@Table
export class Screen extends Model<Screen> {

    id!: number;

    /** The Queue Id. */
    @ForeignKey(() => Queue)
    @Column
    public queueId!: number;

    /** The Queue. */
    @BelongsTo(() => Queue)
    public queue!: Queue;

    /** The access key for this queue. */
    @Column
    @NotEmpty
    @NotNull
    @Unique
    @Column(STRING(255))
    public viewKey!: string;

    /** The access secret for this queue. */
    @Column
    @NotEmpty
    @NotNull
    @Column(STRING(255))
    public viewSecret!: string;



}
