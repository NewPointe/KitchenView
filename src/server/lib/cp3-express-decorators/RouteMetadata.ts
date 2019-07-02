/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IMiddlewareable } from './Middleware';

export class RouteHandlerMetadata {

    public functionKey: string;
    public routes: RouteMetadata[] = [];
    public beforeMiddleware: IMiddlewareable[] = [];
    public afterMiddleware: IMiddlewareable[] = [];

    constructor(functionKey: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
        this.functionKey = functionKey;
        if(beforeMiddleware) this.beforeMiddleware = beforeMiddleware;
        if(afterMiddleware) this.afterMiddleware = afterMiddleware;
    }

}

export class RouteMetadata {

    public method: string;
    public path: string;
    public beforeMiddleware: IMiddlewareable[] = [];
    public afterMiddleware: IMiddlewareable[] = [];

    constructor(method: string, path: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
        this.method = method;
        this.path = path;
        if(beforeMiddleware) this.beforeMiddleware = beforeMiddleware;
        if(afterMiddleware) this.afterMiddleware = afterMiddleware;
    }

}
