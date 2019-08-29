/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IApiErrorData } from "./IApiErrorData";
import { ApiError } from "./ApiError";
import { ApiErrorType } from "./ApiErrorType";

export interface IApiError<TApiErrorType = ApiErrorType, TApiErrorData = IApiErrorData> {
    type: TApiErrorType;
    message: string;
    errorData?: TApiErrorData;
    causedBy?: ApiError;
}
