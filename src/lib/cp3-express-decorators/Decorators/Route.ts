/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { getMetadata, IHasMetadata } from "../ControllerMetadata";
import { IMiddlewareable } from "../Middleware";
import { RouteMetadata } from "../RouteMetadata";

function buildDecorator(method: string, route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return (target: any, key: string, descriptor: any) => {
        const metadata = getMetadata(target as IHasMetadata);
        metadata.addRoute(key, new RouteMetadata(method, route, beforeMiddleware, afterMiddleware));
        return descriptor;
    };
}

export function Route(method: string, route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator(method, route, beforeMiddleware, afterMiddleware);
}

export function All(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("all", route, beforeMiddleware, afterMiddleware);
}

export function Get(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("get", route, beforeMiddleware, afterMiddleware);
}

export function Post(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("post", route, beforeMiddleware, afterMiddleware);
}

export function Put(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("put", route, beforeMiddleware, afterMiddleware);
}

export function Delete(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("delete", route, beforeMiddleware, afterMiddleware);
}

export function Patch(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("patch", route, beforeMiddleware, afterMiddleware);
}

export function Options(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("options", route, beforeMiddleware, afterMiddleware);
}

export function Head(route: string, beforeMiddleware?: IMiddlewareable[], afterMiddleware?: IMiddlewareable[]) {
    return buildDecorator("head", route, beforeMiddleware, afterMiddleware);
}
