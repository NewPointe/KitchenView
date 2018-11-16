/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IncomingMessage, ClientRequest } from 'http';
import { pseudoRandomBytes } from 'crypto';

import { Request } from 'express';
import WebSocket from 'ws';

import { WebsocketServer } from './WebsocketServer';
import { tryParseMessage } from './MessageUtils';
import { getOneQueueForUserId } from '../Util';
import { Queue } from '../../models/Queue';
import { Item } from '../../models/Item';

const KEEPALIVE_INTERVAL = 1000 * 5; // 5 seconds
const KEEPALIVE_MAX_TIME = 1000 * 20; // 20 seconds (4 missed pings)

export function guidv4() {
    const buffer = pseudoRandomBytes(16);
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    let i = 0;
    return "xxxx-xx-xx-xx-xxxxxx".replace(/x/g, () => (buffer[i++] + 0x100).toString(16).substr(1));
}

export class ServerClient {

    private socket: WebSocket;
    private server: WebsocketServer;
    private keepaliveId: NodeJS.Timeout | null = null;
    private keepaliveLastContact: number = 0;
    private authorizedUserId: number;
    private watchedQueueIds = new Set<number>();

    constructor(socket: WebSocket, request: IncomingMessage, server: WebsocketServer) {
        this.socket = socket;
        this.server = server;

        this.socket.on('close', this.OnClose.bind(this));
        this.socket.on('error', this.OnError.bind(this));
        this.socket.on('message', this.OnMessage.bind(this));
        this.socket.on('open', this.OnOpen.bind(this));
        this.socket.on('ping', this.OnPing.bind(this));
        this.socket.on('pong', this.OnPong.bind(this));
        this.socket.on('unexpected-response', this.OnUnexpectedResponse.bind(this));
        this.socket.on('upgrade', this.OnUpgrade.bind(this));

        const requestExt = request as Request;
        this.authorizedUserId = requestExt.user.id;

        this.startKeepalive();
    }

    // Socket Actions
    public send(message: string | Buffer | ArrayBuffer | Buffer[]) {
        if (this.socket.readyState !== WebSocket.OPEN) return false;
        this.socket.send(message);
        return true;
    }

    public ping(data?: Buffer) {
        if (this.socket.readyState !== WebSocket.OPEN) return false;
        this.socket.ping(data);
        return true;
    }

    public terminate() {
        this.stopKeepalive();
        this.socket.terminate();
    }

    public close(code?: number, data?: string) {
        this.stopKeepalive();
        this.socket.close(code, data);
    }

    // Keepalive
    private startKeepalive() {
        if (!this.keepaliveId && this.socket.readyState === WebSocket.OPEN) {
            this.keepaliveLastContact = Date.now();
            this.keepaliveId = setInterval(this.checkKeepalive.bind(this), KEEPALIVE_INTERVAL);
        }
    }

    private stopKeepalive() {
        this.keepaliveId && clearInterval(this.keepaliveId);
        this.keepaliveId = null;
    }

    private checkKeepalive() {
        if (Date.now() - this.keepaliveLastContact > KEEPALIVE_MAX_TIME) this.terminate();
        else this.ping();
    }

    // Incoming Events
    private OnOpen() {
        this.startKeepalive();
    }

    private OnClose(code: number, reason: string) {
        this.stopKeepalive();
    }

    private OnError(error: Error) {
        console.error(`Websocket Server Client Error: `, error);
    }

    private OnMessage(rawmessage: string | Buffer | ArrayBuffer | Buffer[]) {
        this.keepaliveLastContact = Date.now();
        const message = tryParseMessage(rawmessage.toString());
        if (message) {
            switch (message[0]) {
                case 'REGISTER':
                    return this.OnMessage_RegisterQueue(+message[1]);
                case 'UNREGISTER':
                    return this.OnMessage_UnregisterQueue(+message[1]);
                case 'REMOVE':
                    return this.OnMessage_RemoveQueueItem(+message[1]);
            }
        } else {
            this.send(JSON.stringify(['ERROR', "Invalid Message"]));
        }
    }

    private OnPing(data: Buffer) {
        this.keepaliveLastContact = Date.now();
        this.socket.pong(data);
    }

    private OnPong(data: Buffer) {
        this.keepaliveLastContact = Date.now();
    }

    private OnUnexpectedResponse(request: ClientRequest, response: IncomingMessage) {
        // noop
    }

    private OnUpgrade(response: IncomingMessage) {
        // noop
    }

    // Message Handling
    private OnMessage_RegisterQueue(queueId: number) {
        getOneQueueForUserId(this.authorizedUserId, queueId).then(
            queue => {
                if (queue) {
                    this.watchedQueueIds.add(queue.id);
                    this.send(JSON.stringify(['REGISTERED', queueId]));
                }
                else {
                    this.send(JSON.stringify(['REGISTER_ERROR', queueId, "Queue does not exist."]));
                }
            },
            err => {
                this.send(JSON.stringify(['REGISTER_ERROR', queueId, err.message]));
            }
        );
    }

    private OnMessage_UnregisterQueue(queueId: number) {
        this.watchedQueueIds.delete(queueId);
        this.send(JSON.stringify(['UNREGISTERED', queueId]));
    }

    private OnMessage_RemoveQueueItem(queueItemId: number) {
        
    }

    // Queue events
    public OnQueueItemAdded(queue: Queue, item: Item) {
        if (this.watchedQueueIds.has(queue.id))
            this.send(JSON.stringify(['ADDED', {
                queue: {
                    id: queue.id,
                    name: queue.name
                },
                item: {
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    category: item.category,
                    variation: item.variation,
                    notes: item.notes,
                    modifiers: item.modifiers
                }
            }]));
    }

    public OnQueueItemRemoved(queueId: number, itemId: number) {
        if (this.watchedQueueIds.has(queueId))
            this.send(JSON.stringify(['REMOVED', queueId, itemId]));
    }

}
