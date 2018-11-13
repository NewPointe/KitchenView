/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { getMetadata } from "../ControllerMetadata";
import { IMiddlewareable } from "../Middleware";

export function UseBefore(beforeMiddleware: IMiddlewareable) {
    return (target: any, key?: string) => {

        if(key) { // Used on a member
            const metadata = getMetadata(target);
            const handler = metadata.getOrCreateRouteHandler(key);
            handler.beforeMiddleware.unshift(beforeMiddleware);
        }
        else { // Used on a class
            const metadata = getMetadata(target.prototype);
            metadata.beforeMiddleware.unshift(beforeMiddleware);
        }

    };
}
