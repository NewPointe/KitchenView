/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router, IRouterMatcher } from "express";

export type AllowedMethods = { [Key in keyof Router]: Router[Key] extends IRouterMatcher<Router> ? Key : never; }[keyof Router];

export interface IRouteMetadata {
    method: AllowedMethods;
    path: string;
}
