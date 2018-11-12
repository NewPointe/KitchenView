/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import httpError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

export function LoadCommonMergeFields(req: Request, res: Response, next: NextFunction) {
    res.locals.CurrentUser = req.user;
    res.locals.Session = req.session;
    next();
}

export function HandleNotFound(req: Request, res: Response, next: NextFunction) {
    next(new httpError.NotFound());
}

export function HandleErrors(err: Error | httpError.HttpError, req: Request, res: Response, next: NextFunction) {
    const errHttp = err instanceof httpError.HttpError ? err : httpError(err);
    errHttp.expose = process.env.NODE_ENV !== 'production';
    res.status(errHttp.status);
    res.render('error', { error: errHttp });
}
