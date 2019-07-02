/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IMiddlewareable } from './Middleware';
import { RouteMetadata, RouteHandlerMetadata } from './RouteMetadata';

export const METADATA_TAG = "__cp3_express_controller_metadata__";

export interface IHasMetadata {
    [METADATA_TAG]?: ControllerMetadata;
}

export class ControllerMetadata {
    public path: string = "/";
    public beforeMiddleware: IMiddlewareable[] = [];
    public afterMiddleware: IMiddlewareable[] = [];
    private routeHandlers = new Map<string, RouteHandlerMetadata>();

    public getHandlers() {
        return [...this.routeHandlers.values()];
    }
    public getOrCreateRouteHandler(handlerKey: string) {
        let handler = this.routeHandlers.get(handlerKey);
        if (!handler) {
            handler = new RouteHandlerMetadata(handlerKey);
            this.routeHandlers.set(handlerKey, handler);
        }
        return handler;
    }
    public addRoute(handlerKey: string, route: RouteMetadata) {
        this.getOrCreateRouteHandler(handlerKey).routes.push(route);
    }
}

export function getMetadata(target: IHasMetadata): ControllerMetadata {
    if (!target[METADATA_TAG]) target[METADATA_TAG] = new ControllerMetadata();
    return target[METADATA_TAG]!;
}

