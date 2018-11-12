/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Account } from '../models/Account';
import { Merchant } from './Square/Interfaces';
import { queueFilters } from './QueueFilters';
import { Queue } from '../models/Queue';

/**
 * Waits for a promise and then calls the specified callback.
 * @param promise The promise.
 * @param callback The callback.
 */
export async function promise2Callback<T, Q = void>(promise: PromiseLike<T>, callback: (err: Error | null, rtn?: T) => Q) {
    try { return callback(null, await promise); }
    catch (err) { return callback(err as Error, void 0); }
}

function rejectNull<T>(thing: T | null, message: string) {
    if (thing == null) throw new Error(message);
    return thing;
}

export async function getNewOrUpdatedAccount(auth_token: string, merchant: Merchant): Promise<Account> {
    return Account.upsert({
        external_id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        business_name: merchant.business_name || merchant.name,
        auth_token: auth_token
    })
        .then(_ => Account.findOne({ where: { external_id: merchant.id } }))
        .then(account => rejectNull(account, "Could not find account."))
}


export function getClientFilterOptions() {
    return queueFilters.map(f => ({
        id: f.id,
        type: f.typeAliasId,
        ...f.clientOptions
    }))
}

export async function getAllQueuesForUser(user: Account) {
    return Queue.findAll({ where: { accountId: user.id } });
}
export async function getOneQueueForUser(user: Account, queueId: number) {
    return Queue.findOne({ where: { id: queueId, accountId: user.id } });
}
