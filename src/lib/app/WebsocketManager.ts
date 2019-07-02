/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { timingSafeEqual } from 'crypto';

import { Router } from 'express';
import { parseUrl } from 'query-string';

import { HttpManager } from './HttpManager';
import { SessionMiddleware, AuthMiddleware } from './Middleware';
import { WebsocketServer } from '../websocket/WebsocketServer';
import { QueueManager } from './QueueManager';
import { Queue } from '../../models/Queue';
import { Screen } from '../../models/Screen';

export class WebsocketManager {

    private httpManager: HttpManager;
    public readonly server: WebsocketServer;

    private authPipeline: Router;

    constructor(httpManager: HttpManager, sessionMiddleware: SessionMiddleware, authMiddleware: AuthMiddleware, queueManager: QueueManager) {

        this.httpManager = httpManager;

        this.authPipeline = Router();
        this.authPipeline.use(sessionMiddleware.process);
        this.authPipeline.use(authMiddleware.process);
        this.authPipeline.use(authMiddleware.processSession);

        this.server = new WebsocketServer(
            {
                server: this.httpManager.http,
                verifyClient: (info, done) => {

                    const urlOpts = parseUrl(info.req.url || "");

                    if(urlOpts.query && "queueKey" in urlOpts.query && "queueSecret" in urlOpts.query) {
                        const screenKey = urlOpts.query["queueKey"] as string;
                        const screenSecret = urlOpts.query["queueSecret"] as string;

                        Screen.findOne({
                            where: {
                                viewKey: screenKey
                            },
                            include: [Queue]
                        }).then(
                            screen => {
                                if(screen) {
                                    if(timingSafeEqual(Buffer.from(screen.viewSecret, 'utf8'), Buffer.from(screenSecret, 'utf8'))) {
                                        (info.req as any).userId = screen.queue.accountId;
                                        (info.req as any).queueId = screen.queue.id;
                                        done(true);
                                    }
                                    else done(false);
                                }
                                else done(false);
                            }
                        ).catch(() => done(false));
                    }
                    else {
                        done(false);
                    }

                }
            },
            queueManager
        );

    }

}
