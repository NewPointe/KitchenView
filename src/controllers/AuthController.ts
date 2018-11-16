/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Request, Response, NextFunction } from 'express';

import { Controller, Get } from '../lib/cp3-express-decorators';
import { AuthMiddleware } from '../lib/app/Middleware';

@Controller()
export class AuthController {

    constructor(
        private authenticator: AuthMiddleware,
        private authCallbackParameters: {}
    ) { }

    @Get("/:provider")
    public getProvider(req: Request, res: Response, next: NextFunction) {

        const authFunction = this.authenticator.getAuthenticatorFor(req.params["provider"]);
        if(authFunction) return authFunction(req, res, next);
        else next('route');

    }

    @Get("/:provider/callback")
    public getProviderCallback(req: Request, res: Response, next: NextFunction) {

        const authCallbackFunction = this.authenticator.getAuthenticatorCallbackFor(req.params["provider"], this.authCallbackParameters);
        if(authCallbackFunction) return authCallbackFunction(req, res, next);
        else next('route');

    }

}
