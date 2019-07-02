/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Sequelize as SequelizeBase } from 'sequelize';
import debugBuilder from 'debug';

export class DatabaseManager {

    public readonly sequelize: SequelizeBase;

    constructor(modelsRoot: string, options: Partial<SequelizeOptions>) {

        const debugDb = debugBuilder('db');

        this.sequelize = new Sequelize({
            logging: debugDb,
            modelPaths: [modelsRoot],
            ...options
        }) as any as SequelizeBase;

        this.sequelize.sync();

    }

}
