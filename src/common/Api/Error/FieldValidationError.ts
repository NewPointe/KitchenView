/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { ApiErrorType } from "./ApiErrorType";
import { IApiError } from "./IApiError";
import { IApiErrorData } from "./IApiErrorData";

export interface FieldValidationErrorItem extends IApiErrorData {
    id: string;
    message: string;
}

export interface FieldValidationErrorData extends IApiErrorData {
    fields: FieldValidationErrorItem[];
}

export interface FieldValidationError extends IApiError<ApiErrorType.FIELD_VALIDATION_ERROR, FieldValidationErrorData> {}
