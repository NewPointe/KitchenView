/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IncomingMessage } from 'http';
import WebSocket, { Server, ServerOptions } from 'ws';

import { ServerClient } from './ServerClient';
import { QueueManager } from '../app/QueueManager';

import { QueueItem } from '../../models/QueueItem';
import { Queue } from '../../models/Queue';
import { Item } from '../../models/Item';

export class WebsocketServer {
    
    private server: Server;
    private queueManager: QueueManager
    private clients: Set<ServerClient> = new Set<ServerClient>();

    constructor(options: ServerOptions, queueManager: QueueManager) {
        this.server = new Server(options);
        this.queueManager = queueManager
        
        this.server.on('connection', this.OnConnection.bind(this));
        this.server.on('close', this.OnClose.bind(this));
        this.server.on('error', this.OnError.bind(this));
        this.server.on('headers', this.OnHeaders.bind(this));
        this.server.on('listening', this.OnListening.bind(this));

        this.queueManager.on('addItem', this.OnQueueItemAdd.bind(this));
        this.queueManager.on('removeItem', this.OnQueueItemRemove.bind(this));

    }
    
    private OnConnection(socket: WebSocket, request: IncomingMessage) {
        const client = new ServerClient(socket, request, this);
        this.clients.add(client);
        socket.on('close', () => this.clients.delete(client));
    }

    private OnClose() {
        this.clients.forEach(c => c.terminate());
    }

    private OnError(error: Error) {
        console.error(`Websocket Server Error: `, error);
    }

    private OnHeaders(headers: any[], request: IncomingMessage) {
        // noop
    }

    private OnListening() {
        console.log("Websocket Server now listening");
    }

    public OnQueueItemAdd(queue: Queue, item: Item) {
        this.clients.forEach(c => c.OnQueueItemAdded(queue, item));
    }

    public OnQueueItemRemove(queueId: number, itemId: number) {
        this.clients.forEach(c => c.OnQueueItemRemoved(queueId, itemId));
    }
}
