/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { join as joinPath } from 'path';

import express from 'express';
import logger from 'morgan';

import { PassportAuthenticator } from '../PassportAuthenticator';

import { controllerToRouter } from '../cp3-express-decorators/AppBuilder';
import { QueueController, QueueApiController, PageController, AuthController } from '../../controllers';

import { DatabaseManager } from './DatabaseManager';
import { CookieManager } from './CookieManager';
import { SessionManager } from './SessionManager';
import { OAuthManager } from './OAuthManager';
import { HandleNotFound, HandleErrors, LoadCommonMergeFields } from './ExtraMiddleware';
import { HttpManager } from './HttpManager';

// Common dirs
const serverRoot = joinPath(__dirname, '..', '..');
const modelsRoot = joinPath(serverRoot, 'models');
const publicRoot = joinPath(serverRoot, 'public');
const viewsRoot = joinPath(serverRoot, 'views');

export class App {

    private app: express.Express;
    private dbManager: DatabaseManager;
    private authenticator: PassportAuthenticator;
    private oauthManager: OAuthManager;

    constructor(appConfig: any) {

        this.dbManager = new DatabaseManager(modelsRoot, appConfig.db);

        this.app = express();

        this.app.set('trust proxy', 1);
        this.app.set('views', viewsRoot);
        this.app.set('view engine', 'pug');

        this.app.use(logger('dev'));

        new CookieManager(this.app, appConfig.web.cookieSecret);
        new SessionManager(this.app, appConfig.web.cookieSecret, this.dbManager);

        this.oauthManager = new OAuthManager();
        this.oauthManager.loadProvider('oauth2', 'passport-oauth2', appConfig.oauth);

        this.authenticator = new PassportAuthenticator(this.app, this.oauthManager);

        this.app.use(express.static(publicRoot));

        this.app.use(LoadCommonMergeFields);

        this.app.use('/', controllerToRouter(PageController));
        this.app.use('/auth', controllerToRouter(AuthController, this.authenticator, { successRedirect: '/', failureRedirect: '/' }));
        this.app.use('/queues', controllerToRouter(QueueController));
        this.app.use('/api/queues', controllerToRouter(QueueApiController));

        this.app.use(HandleNotFound);
        this.app.use(HandleErrors);
        
        new HttpManager(this.app, appConfig.web);

    }

}
