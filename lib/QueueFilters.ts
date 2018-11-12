/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Filter } from 'querybuilder-helper';
import { PaymentItemization, Payment, WebhookNotification } from './Square/Interfaces';

export interface FilterableItem {
    notification: WebhookNotification;
    item: PaymentItemization;
    payment: Payment;
}

export const queueFilters = [
    new Filter(
        "item.name",
        "string",
        { label: "Item Name", optgroup: "item" },
        (i: FilterableItem) => i.item.name
    ),
    new Filter(
        "item.quantity",
        "string",
        { label: "Item Quantity", optgroup: "item" },
        (i: FilterableItem) => i.item.quantity
    ),
    new Filter(
        "item.notes",
        "string",
        { label: "Item Notes", optgroup: "item" },
        (i: FilterableItem) => i.item.notes
    ),
    new Filter(
        "item.category",
        "string",
        { label: "Item Category", optgroup: "item" },
        (i: FilterableItem) => i.item.item_detail.category_name
    ),
    new Filter(
        "item.variation.name",
        "string",
        { label: "Item Variation Name", optgroup: "item" },
        (i: FilterableItem) => i.item.item_variation_name),
    new Filter(
        "item.id",
        "string",
        { label: "Item Id", optgroup: "item" },
        (i: FilterableItem) => i.item.item_detail.item_id
    ),
    new Filter(
        "item.sku",
        "string",
        { label: "Item SKU", optgroup: "item" },
        (i: FilterableItem) => i.item.item_detail.sku
    ),
    new Filter(
        "item.variation.id",
        "string",
        { label: "Item Variation Id", optgroup: "item" },
        (i: FilterableItem) => i.item.item_detail.item_variation_id
    ),
    new Filter(
        "payment.date",
        "datetime",
        { label: "Purchase Date", optgroup: "item" },
        (i: FilterableItem) => new Date(i.payment.created_at)
    ),
    new Filter(
        "device.name",
        "string",
        { label: "Register Name", optgroup: "register" },
        (i: FilterableItem) => new Date(i.payment.device.name)
    ),
    new Filter(
        "device.id",
        "string",
        { label: "Register Id", optgroup: "register" },
        (i: FilterableItem) => new Date(i.payment.device.id)
    ),
    new Filter(
        "location.id",
        "string",
        { label: "Location Id", optgroup: "location" },
        (i: FilterableItem) => new Date(i.notification.location_id)
    ),
];
