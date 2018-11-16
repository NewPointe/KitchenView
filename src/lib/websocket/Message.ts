/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IncomingMessage } from 'http';
import WebSocket from 'ws';

import { ServerClient } from './ServerClient';

export class IMessageData {
    [key: string]: string | number | boolean;
}

export class IMessageCreatable {
    id?: string;
    type?: string;
    inResponseTo?: string;
    data?: IMessageData;
}

export class Message {
    public readonly id: string;
    public readonly type: string;
    public readonly inResponseTo?: string;
    public readonly data?: IMessageData;

    constructor(id: string, type: string);
    constructor(id: string, type: string, data: IMessageData);
    constructor(id: string, type: string, inResponseTo: string);
    constructor(id: string, type: string, data: IMessageData, inResponseTo: string);
    constructor(id: string, type: string, data?: IMessageData | string, inResponseTo?: string) {
        this.id = id;
        this.type = type;
        if(typeof data === 'string') this.inResponseTo = data;
        else {
            if(data) this.data = data;
            if(inResponseTo) this.inResponseTo = inResponseTo;
        }
    }

    static fromRawMessage() {
        
    }
}
