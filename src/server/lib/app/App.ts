/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { join as joinPath } from 'path';

import express, { RequestHandler, Request as RequestBase } from 'express';

import { controllerToRouter } from '../cp3-express-decorators/AppBuilder';

import { AuthMiddleware, CookieMiddleware, SessionMiddleware, LoggingMiddleware, LoadCommonMergeFields, HandleNotFound, HandleErrors } from './Middleware';
import { DatabaseManager } from './DatabaseManager';
import { HttpManager } from './HttpManager';
import { WebsocketManager } from './WebsocketManager';
import { ScreenViewController, ScreenController, QueueController, QueueApiController, ScreenApiController, PageController, WebhookController } from '../../controllers';

import { IConfig } from '../Config';
import { QueueManager } from './QueueManager';
import { Middleware } from './Middleware/Middleware';
import { Account } from '../../models/Account';

export interface Request<TParams = any, TQuery = any, TBody = any> extends RequestBase {
    user: Account;
    params: Partial<TParams>;
    query: Partial<TQuery>;
    body: Partial<TBody>;
}

// Common dirs

const jsRoot = joinPath(__dirname, '..', '..');
const modelsRoot = joinPath(jsRoot, 'models');
const serverRoot = joinPath(jsRoot, '..');
const publicRoot = joinPath(serverRoot, 'public');
const viewsRoot = joinPath(serverRoot, 'views');

export class App {

    private app: express.Express;
    private dbManager: DatabaseManager;
    private httpManager: HttpManager;
    public readonly websocketManager: WebsocketManager;
    private queueManager: QueueManager;

    constructor(config: IConfig) {

        // Setup database
        this.dbManager = new DatabaseManager(modelsRoot, config.get('db'));

        // Setup queue management
        this.queueManager = new QueueManager();

        // Setup express app
        this.app = express();

        // Set proxy trust
        this.app.set('trust proxy', 1);

        // Setup view engine
        this.app.set('views', viewsRoot);
        this.app.set('view engine', 'pug');

        // Setup request logging
        this.use(new LoggingMiddleware());

        // Setup static files
        this.app.use(express.static(publicRoot));

        // Setup cookies & session
        this.use(new CookieMiddleware(config.get('cookieSecret')));
        const session = new SessionMiddleware(config.get('cookieSecret'), this.dbManager);
        this.use(session);

        // Setup Square auth
        const auth = new AuthMiddleware({
            scope: "MERCHANT_PROFILE_READ,PAYMENTS_READ,ITEMS_READ",
            ...config.get('square')
        });
        this.app.use(auth.process);
        this.app.use(auth.processSession);
        this.app.use('/auth/square', auth.processSquare);
        this.app.use('/auth/square/callback', auth.processSquareCallback);

        // Setup view locals
        this.app.use(LoadCommonMergeFields);

        // Setup view controllers
        this.app.use('/', controllerToRouter(PageController));
        this.app.use('/screen', controllerToRouter(ScreenViewController));
        this.app.use('/queues', controllerToRouter(QueueController));
        this.app.use('/queues/:queueId/screens', controllerToRouter(ScreenController));
        this.app.use('/api/queues', controllerToRouter(QueueApiController));
        this.app.use('/api/screens', controllerToRouter(ScreenApiController));
        this.app.use('/webhook', controllerToRouter(WebhookController, this.queueManager));

        // Setup 404 & error handling
        this.app.use(HandleNotFound);
        this.app.use(HandleErrors);

        // Setup http server
        this.httpManager = new HttpManager(this.app, config.get('port'));

        // Setup websocket server
        this.websocketManager = new WebsocketManager(this.httpManager, session, auth, this.queueManager);

    }

    public use(thing: Middleware | RequestHandler) {
        if(thing instanceof Middleware) this.app.use(thing.process);
        else this.app.use(thing);
    }

}
