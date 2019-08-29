/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response, NextFunction } from "express";
import { getMetadataList } from "./metadata";

export const METAKEY_PARAMETER_TRANSFORMS = Symbol("PARAMETER_TRANSFORMS");
export const METAKEY_OUTPUT_TRANSFORMS = Symbol("OUTPUT_TRANSFORMS");

export type ValueTransformer<TIn, TArgs extends Array<any>, TOut> = (originalValue: TIn, ...originalArgs: TArgs) => TOut;

export interface IHaveHandlers {
    [key: string]: (...args: any[]) => any;
}

export function registerParameterTransform<TTransformer extends ValueTransformer<any, any, any>>(target: Object, propertyKey: string | symbol, parameterIndex: number, transform: TTransformer) {

    let allTransforms = Reflect.getOwnMetadata(METAKEY_PARAMETER_TRANSFORMS, target, propertyKey) as Map<number, TTransformer[]>;

    if (!allTransforms) {
        allTransforms = new Map<number, TTransformer[]>();
        Reflect.defineMetadata(METAKEY_PARAMETER_TRANSFORMS, allTransforms, target, propertyKey);
    }

    let parameterTransforms = allTransforms.get(parameterIndex);

    if (!parameterTransforms) {
        parameterTransforms = [];
        allTransforms.set(parameterIndex, parameterTransforms);
    }

    parameterTransforms.unshift(transform);

}

export function registerOutputTransform<TTransformer extends ValueTransformer<any, any, any>>(target: Object, propertyKey: string | symbol, transform: TTransformer) {

    let parameterTransforms = getMetadataList<TTransformer>(METAKEY_OUTPUT_TRANSFORMS, target, propertyKey);
    parameterTransforms.unshift(transform);

}

export function buildTransforms<T extends IHaveHandlers>(baseObject: T, handlerKey: keyof T & string) {

    const prototype = Object.getPrototypeOf(baseObject) as Object;

    const parametersTransformers = Reflect.getOwnMetadata(METAKEY_PARAMETER_TRANSFORMS, prototype, handlerKey) as Map<number, ValueTransformer<any, any, any>[]>;
    const outputTransformers = getMetadataList<ValueTransformer<any, any, any>>(METAKEY_OUTPUT_TRANSFORMS, prototype, handlerKey);

    return (req: Request, res: Response, next: NextFunction) => {

        const originalParams = [req, res, next]

        const params: any[] = originalParams.slice();

        if (parametersTransformers && parametersTransformers.size > 0) {
            parametersTransformers.forEach((transformers, parameterIndex) => {
                params[parameterIndex] = transformers.reduce((lastOutput, nextTransformer) => nextTransformer(lastOutput, ...originalParams), null);
            });
        }

        const output = baseObject[handlerKey](...params);

        return outputTransformers.reduce((lastOutput, nextTransformer) => nextTransformer(lastOutput, ...originalParams), output);

    };
}
