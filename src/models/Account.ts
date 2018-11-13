/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, AllowNull, HasMany, Unique } from 'sequelize-typescript';
import { Queue } from './Queue';

/**
 * An account.
 */
@Table({
    timestamps: true
})
export class Account extends Model<Account> {

    /** The Square Account Id */
    @Unique
    @AllowNull(false)
    @Column(Sequelize.STRING(255))
    public external_id!: string;

    /** The Account's Name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(255))
    public name!: string;

    /** The Account's Email. */
    @AllowNull(false)
    @Column(Sequelize.STRING(255))
    public email!: string;

    /** The Account's Business Name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(255))
    public business_name!: string;

    /** The Account's Auth Token. */
    @AllowNull(false)
    @Column(Sequelize.STRING(255))
    public auth_token!: string;

    /** The Account's Queues */
    @HasMany(() => Queue)
    public queues!: Queue[];

}
