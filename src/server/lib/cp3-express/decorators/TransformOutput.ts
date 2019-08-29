/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueTransformer } from "../TransformerUtils";

import { NotFound } from 'http-errors';
import { registerOutputTransform } from "../TransformerUtils";
import { Response, Request, NextFunction } from "express";

export function TransformOutput<TIn, TOut>(transformer: ValueTransformer<TIn, [Request, Response, NextFunction], TOut>): MethodDecorator {

    return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {

        const prototype = typeof target === "function" ? target.prototype : target;

        registerOutputTransform(prototype, propertyKey, transformer);

    };

}

type Renderable = Record<string, any> | PromiseLike<Record<string, any>> | null | undefined;

function isPromise<T>(thing: T | PromiseLike<T> | null | undefined): thing is PromiseLike<T> {
    return typeof thing !== "undefined" && thing !== null && 'then' in thing && typeof thing.then === "function";
}

export function Render(template: string) {
    return TransformOutput<Renderable, void>(async (out, req, res, next) => {
        try {

            const realOut = isPromise(out) ? await out : out;

            if (!realOut) return next(new NotFound());

            res.format({
                'html': () => res.render(template, realOut)
            });

        }
        catch (err) {
            next(err);
        }

    });
}

export function RenderJSON() {
    return TransformOutput<Renderable, void>(async (out, req, res, next) => {
        try {

            const realOut = isPromise(out) ? await out : out;

            if(typeof realOut === "undefined") return res.status(204).send();

            if (!realOut) return next(new NotFound());

            res.format({
                'json': () => res.json(realOut)
            });

        }
        catch (err) {
            next(err);
        }

    });
}
