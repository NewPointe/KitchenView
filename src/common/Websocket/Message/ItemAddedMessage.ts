/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { MessageType } from "./MessageType";
import { IMessage } from "./IMessage";
import { IMessageData } from "./IMessageData";

interface ItemAddedMessageData extends IMessageData {
    queue: {
        id: number;
        name: string;
    };
    item: {
        id: number;
        name: string;
        quantity: number;
        category: string;
        variation: string;
        notes: string;
        modifiers: string;
    };
}

export interface ItemAddedMessage extends IMessage<MessageType.ADDED, ItemAddedMessageData> { }
