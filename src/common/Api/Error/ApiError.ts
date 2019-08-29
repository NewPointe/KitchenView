/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { IApiErrorData } from "./IApiErrorData";
import { IApiError } from "./IApiError";
import { ApiErrorType } from "./ApiErrorType";
import { ApiErrorTypeDataTypeMap, AnyApiError } from "./KnownApiError";

export class ApiError implements IApiError {

    constructor(
        public type: ApiErrorType,
        public message: string,
        public errorData?: IApiErrorData,
        public causedBy?: ApiError
    ) {

    }

    public Serialize() {
        return JSON.stringify(this);
    }

    public toString() {
        return this.Serialize();
    }

    public static Deserialize(data: string) {
        const mini = JSON.parse(data) as IApiError<ApiErrorType, ApiErrorTypeDataTypeMap[ApiErrorType]>;
        return new ApiError(mini.type, mini.message, mini.errorData, mini.causedBy) as AnyApiError;
    }

}
