/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MetadataKeys, IRouteMetadata, getMetadataList } from "./metadata";
import { Router, RouterOptions, RequestHandler } from "express";
import { buildTransforms, IHaveHandlers } from "./TransformerUtils";

export class Controller<T extends Controller<T>> {

    [key: string]: ((...parameters: any[]) => any) | any;

    public buildRouter(routerOptionsOverride?: RouterOptions | null): Router {

        const target = Object.getPrototypeOf(this) as Object;

        const routerOptions = routerOptionsOverride || Reflect.getMetadata(MetadataKeys.ROUTER_OPTIONS, target) as RouterOptions;

        const routerMiddleware = getMetadataList<RequestHandler>(MetadataKeys.HANDLER_MIDDLEWARE, target);

        const router = Router(routerOptions);

        const potentialHandlers = Object.getOwnPropertyNames(target) as Array<keyof this & string>;
        for(const propertyKey of potentialHandlers) {
            const routes = this.getRoutesForHandler(target, propertyKey);
            if(routes) {

                const handlerMiddleware = getMetadataList<RequestHandler>(MetadataKeys.HANDLER_MIDDLEWARE, target, propertyKey);

                const transformedHandler = buildTransforms<IHaveHandlers>(this as IHaveHandlers, propertyKey);

                for(const route of routes) {

                    router[route.method](route.path, routerMiddleware, handlerMiddleware, transformedHandler);

                }

            }
        }

        return router;

    }

    public getRoutesForHandler(target: Object, handlerName: keyof this & (string | symbol)) {
        return Reflect.getMetadata(MetadataKeys.HANDLER_ROUTES, target, handlerName) as IRouteMetadata[] | null;
    }

}
