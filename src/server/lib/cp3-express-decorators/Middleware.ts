/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RequestHandler, Request, Response, NextFunction } from 'express';

export type IMiddlewareable = RequestHandler;

export abstract class Middleware {

    public abstract run(req: Request, res: Response, next: NextFunction): any;

}
