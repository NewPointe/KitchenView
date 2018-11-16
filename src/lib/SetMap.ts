/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

export class SetMap<K, V> {
    private store = new Map<K, Set<V>>();

    public get(key: K) {
        return this.store.get(key);
    }

    public add(key: K, value: V) {
        let set = this.store.get(key);
        if(!set) {
            set = new Set();
            this.store.set(key, set);
        }
        return set.add(value);
    }

    public clear(key: K) {
        const set = this.store.get(key);
        if(set) set.clear();
    }

    public delete(key: K, value: V) {
        const set = this.store.get(key);
        if(set) { 
            set.delete(value);
            if(set.size === 0) this.store.delete(key);
        }
    }
}
