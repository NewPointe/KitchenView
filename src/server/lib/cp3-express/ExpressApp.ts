/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express, { Express, RouterOptions } from 'express';

import { Controller } from './Controller';
import { RequestHandler } from 'restify';

export class ExpressApp {
    public readonly app: Express;
    constructor() {

        this.app = express();

    }

    public useController<T extends Controller<T>>(controller: Controller<T>, routerOptionsOverride?: RouterOptions ): void;
    public useController<T extends Controller<T>>(routeOverride: string, controller: Controller<T>, routerOptionsOverride?: RouterOptions ): void;
    public useController<T extends Controller<T>>(controllerOrRouteOverride: string | Controller<T>, routerOptionsOverrideOrController?: Controller<T> | RouterOptions, routerOptionsOverride?: RouterOptions ): void {

        var route: string | null;
        var controller: Controller<T>;
        var routerOptions: RouterOptions | null;

        if(typeof controllerOrRouteOverride !== "string") {
            route = null;
            controller = controllerOrRouteOverride;
            routerOptions = (routerOptionsOverrideOrController as RouterOptions) || null;
        }
        else {
            route = controllerOrRouteOverride;
            controller = routerOptionsOverrideOrController as Controller<T>;
            routerOptions = routerOptionsOverride || null
        }

        const router = controller.buildRouter(routerOptions);
        if(route) this.app.use(route, router);
        else this.app.use(router);

    }
}
