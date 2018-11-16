/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RequestHandler } from 'express';
import { Authenticator } from 'passport';

import { IOauthConfig, OAuthManager } from '../OAuthManager';
import { serializeUser, deserializeUser, verifyUser } from '../../PassportAuth';

export class AuthMiddleware {

    private _process: RequestHandler;
    public get process() {
        return this._process;
    }

    private oauthManager: OAuthManager;
    private authenticator: Authenticator;

    constructor(providers: IOauthConfig[]) {
        this.oauthManager = new OAuthManager();
        this.oauthManager.loadAll(providers);

        this.authenticator = new Authenticator() as object as Authenticator;
        this.authenticator.serializeUser(serializeUser);
        this.authenticator.deserializeUser(deserializeUser);

        this.oauthManager.getProviders().forEach(p => this.authenticator.use(p.buildStrategy("", verifyUser)));

        this._process = this.authenticator.initialize();
    }
    

    public getSessionAuthenticator() {
        return this.authenticator.session();
    }

    public getAuthenticatorFor(provider: string) {
        if(!this.oauthManager.hasProvider(provider)) return null;
        else return this.authenticator.authenticate(provider);
    }

    public getAuthenticatorCallbackFor(provider: string, callbackOptions: any) {
        if(!this.oauthManager.hasProvider(provider)) return null;
        else return this.authenticator.authenticate(provider, callbackOptions);
    }

}
