/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { createServer, Server } from 'http';

import debugBuilder from 'debug';
import { Express } from 'express';

export class HttpManager {

    private app: Express;
    private http: Server;

    constructor(app: Express, httpConfig: any) {

        this.app = app;
        
        this.app.set('port', httpConfig.port);
        
        const debugWeb = debugBuilder('web')
        
        this.http = createServer(app)
            .listen(httpConfig.port)
            .on('error', (error: NodeJS.ErrnoException) => {
                if (error.syscall !== 'listen') {
                    throw error;
                }

                // handle specific listen errors with friendly messages
                switch (error.code) {
                    case 'EACCES':
                        console.error(`Port ${httpConfig.port} requires elevated privileges`);
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        console.error(`Port ${httpConfig.port} is already in use`);
                        process.exit(1);
                        break;
                    default:
                        throw error;
                }
            })
            .on('listening', () => {
                debugWeb(`Listening on ${httpConfig.port}`);
            });
    }

}
