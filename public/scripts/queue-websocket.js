
function setUpSocket() {

    const itemScreen = document.getElementById("item-screen");

    if (!itemScreen) return alert("Error setting up screen.");

    const queueId = itemScreen.dataset.queueId;

    // Map of recent item deletions, used to handle potential out-of-order notifications
    const itemDeletionLog = new Map();

    const ws = new WebSocket("ws://" + location.host + "/");
    ws.onopen = () => {
        
        while(itemScreen.firstChild) itemScreen.removeChild(itemScreen.firstChild);
        ws.send(JSON.stringify(["REGISTER", queueId]));
    }
    ws.onmessage = (messageevent) => {
        const rawmessage = messageevent.data;
        let message = null;
        try {
            message = JSON.parse(rawmessage);
        }
        catch (e) {
            console.log("Error decoding message");
            console.log(rawmessage);
            console.log(e);
            return;
        }

        if (!Array.isArray(message) || message.length < 2) {
            console.log("Invalid message format:" + rawmessage);
            return;
        }

        switch (message[0]) {
            case 'REGISTERED':
                console.log("Successfully registered for updates from queue " + message[1]);
                return;
            case 'REGISTER_ERROR':
                console.log(`Error registering for updates from queue ${message[1]}: ${message[2]}`);
                return;
            case 'UNREGISTERED':
                console.log("Successfully unregistered for updates from queue " + message[1]);
                return;
            case 'ADDED':
                const queueItem = message[1];
                const item = queueItem.item;
                const queue = queueItem.queue;

                if(itemDeletionLog.has(item.id)) return; // Ignore already-deleted items

                console.log("New item was added to a queue: ");
                console.log(message[1]);

                for(const child of itemScreen.children) {
                    if(child.dataset.itemId === item.id) return; // Ignore already-displayed items
                }

                const newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.itemId = item.id;
                newItem.dataset.queueId = queue.id;

                const eQuantity = document.createElement('div');
                eQuantity.classList.add('item-quantity');
                eQuantity.innerText = +item.quantity;
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
                const itemId = message[1];
                const queueId = message[2];

                const now = Date.now()

                // Add to deletion log
                itemDeletionLog.set(itemId, now);

                // clear old entries (older than 5 min) from deletion log
                for(const id of itemDeletionLog.keys()) {
                    if(itemDeletionLog.get(id) < now - (5*60*1000)) {
                        itemDeletionLog.delete(id);
                    }
                };

                const children = Array.from(itemScreen.children); // Copy nodelist to array so we can delete while iterating
                for(const child of children) {
                    if(+child.dataset.itemId === +itemId) {
                        itemScreen.removeChild(child);
                    }
                }

                console.log("Item was removed from a queue: ");
                console.log(message[1], message[2]);
                return;
            default:
                console.log("Unknown message type: " + rawmessage);
        }

    }
    ws.onclose = (closeEvent) => {
        console.log(`Websocket Closed: ${closeEvent.code} ${closeEvent.reason}`);
        setTimeout(setUpSocket, 5 * 1000);
    }
    ws.onerror = (err) => {
        console.log("Websocket Error");
        console.log(err);
    }


}

setUpSocket();
