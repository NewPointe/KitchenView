/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Authenticator } from 'passport';
import { Express } from 'express';
import { serializeUser, deserializeUser, verifyUser } from './PassportAuth';
import { OAuthManager } from './app/OAuthManager';

export class PassportAuthenticator {

    private app: Express;
    private oauthManager: OAuthManager;

    private passport: Authenticator;
    
    constructor(app: Express, oauthManager: OAuthManager) {

        this.app = app;
        this.oauthManager = oauthManager;

        this.passport = new Authenticator() as object as Authenticator;

        this.passport.serializeUser(serializeUser);
        this.passport.deserializeUser(deserializeUser);

        this.oauthManager.getProviders().forEach(p => this.passport.use(p.buildStrategy("", verifyUser)));

        this.app.use(this.passport.initialize());
        this.app.use(this.passport.session());

    }

    public getAuthenticatorFor(provider: string) {
        if(!this.oauthManager.hasProvider(provider)) return null;
        else return this.passport.authenticate(provider);
    }

    public getAuthenticatorCallbackFor(provider: string, callbackOptions: any) {
        if(!this.oauthManager.hasProvider(provider)) return null;
        else return this.passport.authenticate(provider, callbackOptions);
    }
}
