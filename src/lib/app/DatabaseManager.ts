/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize } from 'sequelize-typescript';
import debugBuilder from 'debug';

(Sequelize.Promise as {}) = global.Promise;

export class DatabaseManager {

    public readonly sequelize: Sequelize;

    constructor(modelsRoot: string, options: any) {
        
        const debugDb = debugBuilder('db');
        
        this.sequelize = new Sequelize({
            logging: debugDb,
            modelPaths: [modelsRoot],
            operatorsAliases: false,
            ...options
        });

        this.sequelize.sync();

    }

}
