/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { randomBytes, timingSafeEqual } from 'crypto';

import { Request, Response, NextFunction } from 'express';
import { json as buildJsonParser } from 'body-parser';
import { Unauthorized, BadRequest } from 'http-errors';

export function RequireUser(req: Request, res: Response, next: NextFunction) {
    if (req.user) next();
    else throw new Unauthorized();
}

export function GenerateCsrf(req: Request, res: Response, next: NextFunction) {
    if (req.session && !("csrfToken" in req.session)) req.session.csrfToken = randomBytes(32).toString('hex');
    next();
}

function getCsrfFrom(thing: any): string | null {
    return (thing && "csrfToken" in thing) ? thing.csrfToken : null; // tslint:disable-line:no-unsafe-any
}

export function ValidateCsrf(req: Request, res: Response, next: NextFunction) {
    const sessToken = getCsrfFrom(req.session);
    const bodyToken = getCsrfFrom(req.body);
    if(sessToken !== null && bodyToken !== null && timingSafeEqual(Buffer.from(sessToken, 'utf8'), Buffer.from(bodyToken, 'utf8'))) next();
    else throw new BadRequest("Invalid CSRF Token");
}

export const ParseJson = buildJsonParser({ verify: (req, res, buf) => {
    return (req as any).rawBody = buf.toString();
} });
