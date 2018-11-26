/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { join as joinPath } from 'path';

import express from 'express';

import { controllerToRouter } from '../cp3-express-decorators/AppBuilder';


import { AuthMiddleware, CookieMiddleware, SessionMiddleware, LoggingMiddleware, LoadCommonMergeFields, HandleNotFound, HandleErrors } from './Middleware';
import { DatabaseManager } from './DatabaseManager';
import { HttpManager } from './HttpManager';
import { WebsocketManager } from './WebsocketManager';
import { ScreenViewController, ScreenController, QueueController, QueueApiController, ScreenApiController, PageController, AuthController, WebhookController } from '../../controllers';

import { IConfig } from '../Config';
import { QueueManager } from './QueueManager';


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

    constructor(appConfig: IConfig) {

        this.dbManager = new DatabaseManager(modelsRoot, appConfig.db);
        this.queueManager = new QueueManager();

        this.app = express();

        this.app.set('trust proxy', 1);
        this.app.set('views', viewsRoot);
        this.app.set('view engine', 'pug');

        const logging = new LoggingMiddleware();
        const cookie = new CookieMiddleware(appConfig.web.cookieSecret);
        const session = new SessionMiddleware(appConfig.web.cookieSecret, this.dbManager);
        const auth = new AuthMiddleware([{
            id: "square",
            module: "passport-square",
            options: appConfig.oauth
        }]);

        this.app.use(logging.process);
        this.app.use(cookie.process);
        this.app.use(session.process);
        this.app.use(auth.process);
        this.app.use(auth.getSessionAuthenticator());
        this.app.use(express.static(publicRoot));
        this.app.use(LoadCommonMergeFields);

        this.app.use('/', controllerToRouter(PageController));
        this.app.use('/auth', controllerToRouter(AuthController, auth, { successRedirect: '/', failureRedirect: '/' }));
        this.app.use('/screen', controllerToRouter(ScreenViewController));
        this.app.use('/queues', controllerToRouter(QueueController));
        this.app.use('/queues/:queueId/screens', controllerToRouter(ScreenController));
        this.app.use('/api/queues', controllerToRouter(QueueApiController));
        this.app.use('/api/screens', controllerToRouter(ScreenApiController));
        this.app.use('/webhook', controllerToRouter(WebhookController, this.queueManager));

        this.app.use(HandleNotFound);
        this.app.use(HandleErrors);
        
        this.httpManager = new HttpManager(this.app, appConfig.web);
        
        this.websocketManager = new WebsocketManager(this.httpManager, session, auth, this.queueManager);

    }

}
