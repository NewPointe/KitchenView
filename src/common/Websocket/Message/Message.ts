/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IMessage } from "./IMessage";
import { AnyMessage, MessageTypeDataTypeMap } from "./KnownMessage";
import { MessageType } from "./MessageType";

export class Message<TMessageType extends MessageType> implements IMessage<TMessageType, MessageTypeDataTypeMap[TMessageType]> {

    constructor(
        public readonly type: TMessageType,
        public readonly data: MessageTypeDataTypeMap[TMessageType]
    ) { }

    public Serialize() {
        return JSON.stringify(this);
    }
    public toString() {
        return this.Serialize();
    }
    public static Deserialize(data: string) {
        const message = JSON.parse(data) as IMessage<MessageType, MessageTypeDataTypeMap[MessageType]>;
        return new Message(message.type, message.data) as AnyMessage;
    }
}
