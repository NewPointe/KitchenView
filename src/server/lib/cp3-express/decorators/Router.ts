/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import "reflect-metadata";
import { RouterOptions } from "express";
import { MetadataKeys } from "../metadata";

export function Router(path: string | RouterOptions, options?: RouterOptions): ClassDecorator {

    return <TFunction extends Function>(target: TFunction): TFunction | void => {

        Reflect.defineMetadata(MetadataKeys.ROUTER_PATH, path, target.prototype as Object);

        if(options) Reflect.defineMetadata(MetadataKeys.ROUTER_OPTIONS, options, target.prototype as Object);

        return target;

    };
}
