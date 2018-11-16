/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Request, Response, NextFunction } from 'express';
import { Controller, Get } from '../lib/cp3-express-decorators';

import { getAllQueuesForUserId } from '../lib/Util';



@Controller()
export class PageController {

    @Get("/")
    public getIndex(req: Request, res: Response, next: NextFunction) {

        if (!req.user) res.render('index');
        else getAllQueuesForUserId(req.user.Id).then(
            UserQueues => res.render('index', { UserQueues })
        );
        
    }

    @Get("/login")
    public getLogin(req: Request, res: Response, next: NextFunction) {
        res.redirect('/auth/square');
    }

    @Get("/logout")
    public getLogout(req: Request, res: Response, next: NextFunction) {
        req.logout();
        res.redirect('/');
    }

}
