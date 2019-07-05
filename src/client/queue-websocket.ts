/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "../common/Websocket/Message/Message";
import { MessageType } from "../common/Websocket/Message/MessageType";

function setUpSocket() {

    const itemScreen = document.getElementById("item-screen");

    if (!itemScreen) return;

    // const queueId = itemScreen.dataset.queueId;
    const queueKey = itemScreen.dataset.queueKey;
    const queueSecret = itemScreen.dataset.queueSecret;

    // Map of recent item deletions, used to handle potential out-of-order notifications
    const itemDeletionLog = new Map<number, number>();

    const wsProtocol = location.protocol === "https:" ? "wss://" : "ws://";

    const ws = new WebSocket(`${wsProtocol}${location.host}/?queueKey=${queueKey}&queueSecret=${queueSecret}`);

    ws.onopen = () => {
        while (itemScreen.firstChild) itemScreen.removeChild(itemScreen.firstChild);
        //ws.send(JSON.stringify(["REGISTER", queueId]));
    };

    ws.onmessage = (messageevent) => {
        const rawmessage = messageevent.data as string;

        let message;

        try {
            message = Message.Deserialize(rawmessage);
        }
        catch (e) {
            console.log("Error decoding message");
            console.log(rawmessage);
            console.log(e);
            return;
        }

        switch (message.type) {
            case MessageType.REGISTERED:
                console.log(`Successfully registered for updates from queue.`);
                return;
            case MessageType.REGISTER_ERROR:
                console.log(`Error registering for updates from queue.`);
                return;
            case MessageType.UNREGISTERED:
                console.log(`Successfully unregistered for updates from queue.`);
                return;
            case MessageType.ADDED:

                const item = message.data.item;
                const queue = message.data.queue;

                if (itemDeletionLog.has(item.id)) return; // Ignore already-deleted items

                console.log("New item was added to a queue: ");
                console.log(item);

                for (const child of itemScreen.children) {
                    if (child instanceof HTMLElement && +(child.dataset["itemId"] || 0) === item.id) return; // Ignore already-displayed items
                }

                const newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.itemId = `${item.id}`;
                newItem.dataset.queueId = `${queue.id}`;

                const eQuantity = document.createElement('div');
                eQuantity.classList.add('item-quantity');
                eQuantity.innerText = `${item.quantity}`;
                newItem.append(eQuantity);

                const eName = document.createElement('div');
                eName.classList.add('item-name');
                eName.innerText = `${item.variation} ${item.name}`;
                newItem.append(eName);

                // const eCategory = document.createElement('div');
                // eCategory.classList.add('item-category');
                // eCategory.innerText = item.category;
                // newItem.append(eCategory);

                const eModifiers = document.createElement('div');
                eModifiers.classList.add('item-modifiers');
                eModifiers.innerText = item.modifiers;
                newItem.append(eModifiers);

                const eNotes = document.createElement('div');
                eNotes.classList.add('item-notes');
                eNotes.innerText = item.notes;
                newItem.append(eNotes);

                const removeButton = document.createElement('a');
                removeButton.href = '#';
                removeButton.classList.add("btn", "btn-danger");
                removeButton.innerText = "Remove";
                removeButton.addEventListener("click", e => {
                    removeButton.innerText = "Removing...";
                    ws.send(JSON.stringify(["REMOVE", item.id, queue.id]));
                });
                newItem.append(removeButton);

                itemScreen.append(newItem);

                return;
            case 'REMOVED':

                const now = Date.now();

                // Add to deletion log
                itemDeletionLog.set(message.data.itemId, now);

                // clear old entries (older than 5 min) from deletion log
                for (const id of itemDeletionLog.keys()) {
                    if (itemDeletionLog.get(id) || 0 < now - (5 * 60 * 1000)) {
                        itemDeletionLog.delete(id);
                    }
                }

                const children = Array.from(itemScreen.children); // Copy nodelist to array so we can delete while iterating
                for (const child of children) {
                    if (child instanceof HTMLElement && +(child.dataset["itemId"] || 0) === message.data.itemId) {
                        itemScreen.removeChild(child);
                    }
                }

                console.log("Item was removed from a queue: ");
                console.log(message.data);
                return;
            default:
                console.log("Unknown message type: " + rawmessage);
        }

    };
    ws.onclose = (closeEvent) => {
        console.log(`Websocket Closed: ${closeEvent.code} ${closeEvent.reason}`);
        setTimeout(setUpSocket, 5 * 1000);
    };
    ws.onerror = (err) => {
        console.log("Websocket Error");
        console.log(err);
    };


}

setUpSocket();
