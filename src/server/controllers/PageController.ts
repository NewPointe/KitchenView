/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Request, Response, NextFunction } from 'express';

import { Account } from '../models/Account';

import { getAllQueuesForUserId } from '../lib/Util';
import { Controller, Get, Render, User } from '../lib/cp3-express';

export class PageController extends Controller<PageController> {

    @Get("/")
    @Render("index")
    public async getIndex(@User() user: Account) {
        return user ? { UserQueues: await getAllQueuesForUserId(user.id) } : { };
    }

    @Get("/login")
    public getLogin(req: Request, res: Response, next: NextFunction) {
        res.redirect('/auth/square');
    }

    @Get("/logout")
    public getLogout(req: Request, res: Response, next: NextFunction) {
        (req as any).logout();
        res.redirect('/');
    }

}
