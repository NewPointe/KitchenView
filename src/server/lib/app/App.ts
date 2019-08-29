/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { join as joinPath } from 'path';

import express, { RequestHandler } from 'express';

import { AuthMiddleware, CookieMiddleware, SessionMiddleware, LoggingMiddleware, LoadCommonMergeFields, HandleNotFound, HandleErrors } from './Middleware';
import { DatabaseManager } from './DatabaseManager';
import { HttpManager } from './HttpManager';
import { WebsocketManager } from './WebsocketManager';
import { ScreenViewController, ScreenController, QueueController, QueueApiController, ScreenApiController, PageController, WebhookController } from '../../controllers';

import { IConfig } from '../Config';
import { QueueManager } from './QueueManager';
import { Middleware } from './Middleware/Middleware';
import { ExpressApp } from '../cp3-express/ExpressApp';

// Common dirs

const jsRoot = joinPath(__dirname, '..', '..');
const modelsRoot = joinPath(jsRoot, 'models');
const distRoot = joinPath(jsRoot, '..');
const serverRoot = joinPath(distRoot, '..');
const publicRoot = joinPath(serverRoot, 'public');
const viewsRoot = joinPath(serverRoot, 'views');
const clientRoot = joinPath(distRoot, 'client');
const clientScriptRoot = joinPath(clientRoot, 'scripts');
const clientStyleRoot = joinPath(clientRoot, 'styles');

export class App extends ExpressApp {

    private dbManager: DatabaseManager;
    private httpManager: HttpManager;
    public readonly websocketManager: WebsocketManager;
    private queueManager: QueueManager;

    constructor(config: IConfig) {

        super();

        // Setup database
        this.dbManager = new DatabaseManager(modelsRoot, config.get('db'));

        // Setup queue management
        this.queueManager = new QueueManager();

        // Set proxy trust
        this.app.set('trust proxy', 1);

        // Setup view engine
        this.app.set('views', viewsRoot);
        this.app.set('view engine', 'pug');

        // Setup request logging
        this.useMiddleware(new LoggingMiddleware());

        // Setup static files
        this.app.use(express.static(publicRoot));
        this.app.use('/scripts', express.static(clientScriptRoot));
        this.app.use('/styles', express.static(clientStyleRoot));

        // Setup cookies & session
        this.useMiddleware(new CookieMiddleware(config.get('cookieSecret')));
        const session = new SessionMiddleware(config.get('cookieSecret'), this.dbManager);
        this.useMiddleware(session);

        // Setup Square auth
        const auth = new AuthMiddleware({
            scope: "MERCHANT_PROFILE_READ,PAYMENTS_READ,ITEMS_READ",
            ...config.get('square')
        });
        this.app.use(auth.process);
        this.app.use(auth.processSession);
        this.app.get('/auth/square', auth.processSquare);
        this.app.get('/auth/square/callback', auth.processSquareCallback);

        // Setup view locals
        this.app.use(LoadCommonMergeFields);

        // Setup view controllers
        this.useController('/', new PageController());
        this.useController('/screen', new ScreenViewController());
        this.useController('/queues', new QueueController());
        this.useController('/queues/:queueId/screens', new ScreenController(), { mergeParams: true });
        this.useController('/api/queues', new QueueApiController());
        this.useController('/api/screens', new ScreenApiController());
        this.useController('/webhook', new WebhookController(this.queueManager));

        // Setup 404 & error handling
        this.app.use(HandleNotFound);
        this.app.use(HandleErrors);

        // Setup http server
        this.httpManager = new HttpManager(this.app, config.get('port'));

        // Setup websocket server
        this.websocketManager = new WebsocketManager(this.httpManager, session, auth, this.queueManager);

    }

    public useMiddleware(thing: Middleware | RequestHandler) {
        if(thing instanceof Middleware) this.app.use(thing.process);
        else this.app.use(thing);
    }

}
