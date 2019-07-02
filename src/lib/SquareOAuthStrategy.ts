/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Strategy as OAuth2Strategy, StrategyOptions, VerifyFunction } from 'passport-oauth2';
import request from 'request-promise-native';

import { Merchant } from './Square/Interfaces';

export interface SquareOAuthStrategyOptions extends Partial<StrategyOptions> {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

export class SquareOAuthStrategy extends OAuth2Strategy {

    public constructor(options: SquareOAuthStrategyOptions, verify: VerifyFunction) {
        const squareOptions: StrategyOptions = {
            authorizationURL: "https://connect.squareup.com/oauth2/authorize",
            tokenURL: "https://connect.squareup.com/oauth2/token",
            scope: "MERCHANT_PROFILE_READ",
            scopeSeparator: ",",
            ...options
        };
        super(squareOptions, verify);
        this.name = 'square';
    }

    public userProfile(accessToken: string, done: (err?: Error | null, profile?: Merchant) => void): void {

        request({
            method: "GET",
            url: "https://connect.squareup.com/v1/me",
            headers: { "Authorization": `Bearer ${accessToken}` },
            json: true
        })
        .then((merchant: Merchant) => done(null, merchant))
        .catch((error: Error) => done(error, void 0));

    }
}
