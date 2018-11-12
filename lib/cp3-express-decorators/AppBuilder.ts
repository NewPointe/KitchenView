/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { getMetadata } from './ControllerMetadata';
import { Router, IRouterMatcher } from 'express';

export function controllerToRouter(ControllerType: any, ...args: any[]) {
    const controller = new ControllerType(...args);
    const metadata = getMetadata(ControllerType.prototype);

    const router = Router({ mergeParams: true });
    
    metadata.beforeMiddleware.forEach(m => router.use(m));
    metadata.getHandlers().forEach(rh => {
        const handler = controller[rh.functionKey].bind(controller);
        rh.routes.forEach(r => {
            const routerMethod = (router as any)[r.method] as IRouterMatcher<Router>;
            routerMethod.call(router, r.path, ...rh.beforeMiddleware, ...r.beforeMiddleware, handler, ...r.afterMiddleware, ...rh.afterMiddleware);
        });
    })
    metadata.afterMiddleware.forEach(m => router.use(m));

    return router;
}
