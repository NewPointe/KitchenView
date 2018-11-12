/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { getMetadata } from "../ControllerMetadata";
import { IMiddlewareable } from "../Middleware";

export function Controller(path?: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return (target: any) => {
        const metadata = getMetadata(target.prototype);
        if(path) metadata.path = path;
        if(beforeMiddleware) metadata.beforeMiddleware = beforeMiddleware;
        if(afterMiddleware) metadata.afterMiddleware = afterMiddleware;
    };
}
