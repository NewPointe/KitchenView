/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Express, Request, Response, Router } from 'express';


import { HttpManager } from './HttpManager';
import { SessionMiddleware, AuthMiddleware } from './Middleware';
import { WebsocketServer } from '../websocket/WebsocketServer';
import { QueueManager } from './QueueManager';

export class WebsocketManager {

    private httpManager: HttpManager;
    public readonly server: WebsocketServer;

    private authPipeline: Router;

    constructor(httpManager: HttpManager, sessionMiddleware: SessionMiddleware, authMiddleware: AuthMiddleware, queueManager: QueueManager) {

        this.httpManager = httpManager;

        this.authPipeline = Router();
        this.authPipeline.use(sessionMiddleware.process);
        this.authPipeline.use(authMiddleware.process);
        this.authPipeline.use(authMiddleware.getSessionAuthenticator());

        this.server = new WebsocketServer(
            {
                server: this.httpManager.http,
                verifyClient: (info, done) => {

                    const req = info.req as Request;
                    const res = {} as Response;

                    this.authPipeline(req, res, () => done(!!req.user));

                }
            },
            queueManager
        );

    }

}
