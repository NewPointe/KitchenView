/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Strategy } from 'passport';
import { VerifyFunction } from '../PassportAuth';

export interface IStrategyConfig {
    [key: string]: {};
}

export interface IOauthConfig {
    id: string;
    module: string;
    options: IStrategyConfig;
}

export type StrategyType = new (config: IStrategyConfig, verifyFunction: VerifyFunction) => Strategy;

class OAuthProvider {

    private _id: string;
    get id() {
        return this._id;
    }

    private _Strategy: StrategyType;
    get Strategy() {
        return this._Strategy;
    }

    private _strategyOptions: IStrategyConfig;
    get strategyOptions() {
        return this._strategyOptions;
    }

    constructor(id: string, Strategy: StrategyType, strategyOptions: IStrategyConfig) {
        this._id = id;
        this._Strategy = Strategy;
        this._strategyOptions = strategyOptions;
    }

    public buildStrategy(callbackURL: string, verifyFunction: VerifyFunction): Strategy {
        return new this.Strategy({ callbackURL, ...this.strategyOptions }, verifyFunction);
    }
}

export class OAuthManager {

    private providers: Map<string, OAuthProvider> = new Map();

    public loadAll(config: IOauthConfig[]) {
        return config.map(p => this.loadProvider(p.id, p.module, p.options));
    }

    public loadProvider(id: string, strategySource: string, strategyOptions: IStrategyConfig) {
        if(this.providers.has(id)) throw new Error(`A provider with id '${id}' has already been loaded.`);
        
        const strategyModule = require(strategySource);
        if(!('Strategy' in strategyModule)) throw new Error("The given strategySource has no Strategy.");

        const provider = new OAuthProvider(id, strategyModule.Strategy, strategyOptions);
        this.providers.set(id, provider);
        return provider;
    }

    public hasProvider(id: string) {
        return this.providers.has(id);
    }

    public getProviders() {
        return [...this.providers.values()];
    }


}
