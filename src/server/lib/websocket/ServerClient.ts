/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IncomingMessage, ClientRequest } from 'http';

import WebSocket from 'ws';

import { WebsocketServer } from './WebsocketServer';

import { Queue } from '../../models/Queue';
import { Item } from '../../models/Item';
import { QueueItem } from '../../models/QueueItem';
import { getOneQueueForUserId } from '../Util';

import { Message } from '../../../common/Websocket/Message/Message';
import { MessageType } from '../../../common/Websocket/Message/MessageType';

const KEEPALIVE_INTERVAL = 1000 * 5; // 5 seconds
const KEEPALIVE_MAX_TIME = 1000 * 20; // 20 seconds (4 missed pings)

export class ServerClient {

    private socket: WebSocket;
    private server: WebsocketServer;
    private keepaliveId: NodeJS.Timeout | null = null;
    private keepaliveLastContact: number = 0;
    private authorizedUserId: number;
    private authorizedQueueId: number;

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

        this.authorizedUserId = (request as any).userId;
        this.authorizedQueueId = (request as any).queueId;

        Queue.findOne({
            where: { id: this.authorizedQueueId },
            include: [{
                model: QueueItem,
                include: [Item]
            }]
        }).then(
            queue => {
                if (queue) {
                    for (const queueItem of queue.queueItems) {
                        this.OnQueueItemAdded(queueItem.item, queue);
                    }
                }
            },
            () => { /* */ }
        );

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
        if(this.keepaliveId) clearInterval(this.keepaliveId);
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
        try {
            const message = Message.Deserialize(rawmessage.toString());
            switch (message.type) {
                case MessageType.REMOVE:
                    return this.OnMessage_RemoveQueueItem(message.data.itemId, message.data.queueId);
            }
        }
        catch(e) {
            console.error(e);
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

    private OnMessage_RemoveQueueItem(itemId: number, queueId: number) {
        getOneQueueForUserId(this.authorizedUserId, queueId).then(
            async queue => {
                if (queue) await this.server.queueManager.removeItemFromQueue(itemId, queueId);
                else this.send(new Message(MessageType.REMOVE_ERROR, { itemId, queueId, message: "Queue does not exist." }).Serialize());
            },
            (err: Error) => {
                this.send(new Message(MessageType.REMOVE_ERROR, { itemId, queueId, message: err.message }).Serialize());
            }
        );
    }

    // Queue events
    public OnQueueItemAdded(item: Item, queue: Queue) {
        if (this.authorizedQueueId === queue.id) {
            this.send(new Message(
                MessageType.ADDED,
                {
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
                }
            ).Serialize());
        }
    }

    public OnQueueItemRemoved(itemId: number, queueId: number) {
        if (this.authorizedQueueId === queueId) {
            this.send(new Message(MessageType.REMOVED, { itemId, queueId }).Serialize());
        }
    }

}
