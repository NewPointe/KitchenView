/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

export enum MessageType {
    REGISTER = "REGISTER",
    REGISTER_ERROR = "REGISTER_ERROR",
    REGISTERED = "REGISTERED",
    UNREGISTER = "UNREGISTER",
    UNREGISTERED = "UNREGISTERED",
    REMOVE = "REMOVE",
    REMOVED = "REMOVED",
    ADDED = "ADDED",
    ERROR = "ERROR",
}

export interface ItemAddedMessageData {
    queue: {
        id: number,
        name: string
    };
    item: {
        id: number,
        name: string,
        quantity: number,
        category: string,
        variation: string,
        notes: string,
        modifiers: string
    };
}

export interface ItemRemovedMessageData {
    itemId: number;
    queueId: number;
}
