/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { ItemAddedMessage } from "./ItemAddedMessage";
import { ItemRemovedMessage } from "./ItemRemovedMessage";
import { RemoveItemMessage } from "./RemoveItemMessage";
import { RemoveItemErrorMessage } from "./RemoveItemErrorMessage";
import { MessageType } from "./MessageType";
import { IMessage } from "./IMessage";
import { IMessageData } from "./IMessageData";

// Type mapping helpers
// Adapted from https://stackoverflow.com/a/50125960

type FilterKeyType<T, K extends keyof T, V> = Extract<T, Record<K, V>>;
type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = { [V in T[K]]: FilterKeyType<T, K, V> };
type SelectProperty<T, K extends keyof T[keyof T]> = { [V in keyof T]: T[V][K] };
type MapNeverToDefault<T, D> = { [V in keyof T]: T[V] extends never ? D : T[V] };

export interface UnknownMessage extends IMessage<Exclude<MessageType, KnownMessageType>, IMessageData> { }

export type KnownMessage = ItemAddedMessage | ItemRemovedMessage | RemoveItemMessage | RemoveItemErrorMessage;
export type KnownMessageType = KnownMessage["type"];

export type AnyMessage = KnownMessage | UnknownMessage;
export type MessageTypeDataTypeMap = MapNeverToDefault<SelectProperty<MapDiscriminatedUnion<AnyMessage, "type">, "data">, IMessageData>;


