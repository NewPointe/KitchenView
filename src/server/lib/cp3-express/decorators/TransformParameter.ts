/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NextFunction, Response, Request } from "express";
import { BadRequest } from 'http-errors';

import { ValueTransformer, registerParameterTransform } from "../TransformerUtils";

export function TransformParameter<TIn, TOut>(transform: ValueTransformer<TIn, [Request, Response, NextFunction], TOut>): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {

        const prototype = typeof target === "function" ? target.prototype : target;
        registerParameterTransform(prototype, propertyKey, parameterIndex, transform);

    };
}

export function RouteParam(parameter: string): ParameterDecorator {
    return TransformParameter<null, string>((input, req, res, next) => {
        return req.params[parameter];
    });
}

export function QueryParam(parameter: string): ParameterDecorator {
    return TransformParameter<null, string>((input, req, res, next) => {
        return req.query[parameter];
    });
}

export function BodyParam(parameter: string): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req.body[parameter];
    });
}

export function Param(parameter: string): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        if (req.params && parameter in req.params && typeof req.params[parameter] !== 'undefined') return req.params[parameter];
        if (req.query && parameter in req.query && typeof req.query[parameter] !== 'undefined') return req.query[parameter];
        if (req.body && parameter in req.body && typeof req.body[parameter] !== 'undefined') return req.body[parameter];
        return void 0;
    });
}

export function Body(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req.body;
    });
}

export function Req(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req;
    });
}

export function Res(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return res;
    });
}

export function Next(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return next;
    });
}

export function User(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req.user;
    });
}

function tryParseInt(thing: unknown, radix: number) {
    try {
        return parseInt(thing as string, radix);
    }
    catch (e) {
        return NaN;
    }
}

export function AsInt(options?: { radix?: number, default?: any }): ParameterDecorator {

    const opt = {
        radix: 10,
        default: NaN,
        ...options
    }

    return TransformParameter((input, req, res, next) => {

        const rtn = tryParseInt(input, opt.radix);

        if(!Number.isNaN(rtn)) {
            return rtn;
        }
        else {
            return opt.default;
        }

    });

}

export function AsId(options?: { radix?: number, default?: any }): ParameterDecorator {

    const opt = {
        radix: 10,
        default: NaN,
        ...options
    }

    return TransformParameter((input, req, res, next) => {

        const rtn = tryParseInt(input, opt.radix);

        if(!Number.isNaN(rtn) && Number.isFinite(rtn) && Number.isInteger(rtn) && rtn > 0) {
            return rtn;
        }
        else {
            return opt.default;
        }

    });

}

export function Required(message: string = "Parameter is required"): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        if (typeof input === "undefined" || input === null || (typeof input === "number" && Number.isNaN(input))) {
            throw new BadRequest(message);
        }
        else {
            return input;
        }
    });
}
