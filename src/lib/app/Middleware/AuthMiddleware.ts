/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RequestHandler } from 'express';
import { Authenticator } from 'passport';

import { serializeUser, deserializeUser, verifyUser } from '../../PassportAuth';
import { SquareOAuthStrategy, SquareOAuthStrategyOptions } from '../../SquareOAuthStrategy';
import { Middleware } from './Middleware';

export class AuthMiddleware extends Middleware {

    public readonly processSession: RequestHandler;
    public readonly processSquare: RequestHandler;
    public readonly processSquareCallback: RequestHandler;

    constructor(squareOAuthOptions: SquareOAuthStrategyOptions) {

        const authenticator = new Authenticator() as unknown as Authenticator<RequestHandler, RequestHandler>;

        authenticator.serializeUser(serializeUser);
        authenticator.deserializeUser(deserializeUser);

        authenticator.use(new SquareOAuthStrategy(squareOAuthOptions, verifyUser));

        super(authenticator.initialize());
        this.processSession = authenticator.session();
        this.processSquare = authenticator.authenticate('square');
        this.processSquareCallback = authenticator.authenticate('square', { successRedirect: '/', failureRedirect: '/' });

    }

}
