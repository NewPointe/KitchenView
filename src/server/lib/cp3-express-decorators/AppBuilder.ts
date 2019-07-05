/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { getMetadata, IHasMetadata } from './ControllerMetadata';
import { Router, IRouterMatcher, RequestHandler } from 'express';

export function controllerToRouter<TArgs extends Array<unknown>>(ControllerType: new(...args: TArgs ) => any, ...args: TArgs) {
    const controller = new ControllerType(...args) as Record<string, RequestHandler>;
    const metadata = getMetadata(ControllerType.prototype as IHasMetadata);

    const router = Router({ mergeParams: true });

    metadata.beforeMiddleware.forEach(m => router.use(m));
    metadata.getHandlers().forEach(rh => {
        const handler = controller[rh.functionKey].bind(controller);
        rh.routes.forEach(r => {
            const routerMethod = (router as any)[r.method] as IRouterMatcher<Router>;
            routerMethod.call<Router, [string, RequestHandler[]], Router>(router, r.path, [...rh.beforeMiddleware, ...r.beforeMiddleware, handler, ...r.afterMiddleware, ...rh.afterMiddleware]);
        });
    });
    metadata.afterMiddleware.forEach(m => router.use(m));

    return router;
}
