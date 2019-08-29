/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Gets an inheritance-safe list from metadata.
 * @param metadataKey The metadata key.
 * @param target The metadata target.
 * @param propertyKey The property key.
 */
export function getMetadataList<TListItem>(
    metadataKey: string | symbol,
    target: Object,
    propertyKey?: string | symbol
): Array<TListItem> {

    // Try to get an existing list
    const existingList = propertyKey ? Reflect.getMetadata(metadataKey, target, propertyKey) as TListItem[] : Reflect.getMetadata(metadataKey, target) as TListItem[];

    // If we have have an existing list, create a copy so we keep any inheritence intact
    const newList = existingList && Array.isArray(existingList) ? existingList.slice() : [];

    // Save the list
    if (propertyKey) Reflect.defineMetadata(metadataKey, newList, target, propertyKey); else Reflect.defineMetadata(metadataKey, newList, target);

    // Return the list
    return newList;

}
