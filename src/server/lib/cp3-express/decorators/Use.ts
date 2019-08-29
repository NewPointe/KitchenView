/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestHandler } from "express";
import { MetadataKeys, getMetadataList } from "../metadata";

type MixedArray<T> = Array<T | Array<T>>;

function flatten<T>(things: MixedArray<T>) {
    return things.reduce((acc: T[], val) => acc.concat(val), []);
}

export function Use(...middleware: MixedArray<RequestHandler>): ClassDecorator & MethodDecorator {

    return <T, TFunction = Function | Object>(
        target: TFunction,
        propertyKey?: string | symbol,
        descriptor?: TypedPropertyDescriptor<T>
    ) => {

        const metadataTarget = (typeof target === "function" ? target.prototype : target) as Object;

        const middlewareList = getMetadataList<RequestHandler>(MetadataKeys.HANDLER_MIDDLEWARE, metadataTarget, propertyKey);

        middlewareList.unshift(...flatten(middleware));

        return;

    };

}
