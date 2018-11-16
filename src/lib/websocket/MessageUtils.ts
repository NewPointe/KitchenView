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

export interface IMessage {
    //    id: string;
    type: MessageType;
    [key: string]: string | number | boolean;
}

type ArrMessage = [MessageType, string | number | boolean];

function validateMessage(thing: any): thing is ArrMessage {
    return Array.isArray(thing)
        && thing.length === 2
        && thing[0] in MessageType
        && (
            typeof thing[1] !== 'string'
            || typeof thing[1] !== 'number'
            || typeof thing[1] !== 'boolean'
        );
}

export function tryParseMessage(messageStr: string): ArrMessage | null {
    try {
        const message = JSON.parse(messageStr);
        return validateMessage(message) ? message : null;
    } catch (e) {
        return null;
    }
}
