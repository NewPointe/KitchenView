/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { FieldValidationError } from "./FieldValidationError";
import { ApiErrorType } from "./ApiErrorType";
import { IApiError } from "./IApiError";
import { IApiErrorData } from "./IApiErrorData";

// Type mapping helpers
// Adapted from https://stackoverflow.com/a/50125960

type FilterKeyType<T, K extends keyof T, V> = Extract<T, Record<K, V>>;
type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = { [V in T[K]]: FilterKeyType<T, K, V> };
type SelectProperty<T, K extends keyof T[keyof T]> = { [V in keyof T]: T[V][K] };
type MapNeverToDefault<T, D> = { [V in keyof T]: T[V] extends never ? D : T[V] };

export interface UnknownApiError extends IApiError<Exclude<ApiErrorType, KnownApiErrorType>, IApiErrorData> { }

export type KnownApiError = FieldValidationError;
export type KnownApiErrorType = KnownApiError["type"];

export type AnyApiError = KnownApiError | UnknownApiError;
export type ApiErrorTypeDataTypeMap = MapNeverToDefault<SelectProperty<MapDiscriminatedUnion<AnyApiError, "type">, "errorData">, IApiErrorData>;

