/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import * as path from 'path';

import convict from 'convict';

const config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    domain: {
        doc: "The canonical domain for the app, used for webhook verification and oauth callbacks.",
        format: "*",
        default: "localhost",
        env: "DOMAIN",
        arg: "domain"
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 8080,
        env: "PORT",
        arg: "port"
    },
    cookieSecret: {
        doc: "The cookie secret.",
        format: "*",
        default: "",
        env: "COOKIE_SECRET",
        arg: "cookiesecret",
        sensitive: true
    },
    db: {
        dialect: {
            doc: "The type of database.",
            format: ["mysql", "mariadb", "sqlite", "postgres", "mssql"],
            default: "sqlite" as "mysql" | "mariadb" | "sqlite" | "postgres" | "mssql",
            env: "DB_DIALECT",
            arg: "dbdialect"
        },
        host: {
            doc: "The database hostname.",
            format: "*",
            default: "localhost",
            env: "DB_HOST",
            arg: "dbhost"
        },
        port: {
            doc: "The database port.",
            format: "port",
            default: 3306,
            env: "DBPORT",
            arg: "dbport"
        },
        database: {
            doc: "The database name.",
            format: "*",
            default: "kitchenview",
            env: "DB_NAME",
            arg: "dbname"
        },
        username: {
            doc: "The database username.",
            format: "*",
            default: "kitchenview",
            env: "DB_USERNAME",
            arg: "dbusername"
        },
        password: {
            doc: "The database password.",
            format: "*",
            default: "kitchenview",
            env: "DB_PASSWORD",
            arg: "dbpassword",
            sensitive: true
        },
        storage: {
            doc: "The file location for sqlite databases.",
            format: "*",
            default: "kitchenview.sqlite",
            env: "DB_STORAGE",
            arg: "dbstorage"
        }
    },
    square: {
        clientID: {
            doc: "The Client Id for your app.",
            format: "*",
            default: "",
            env: "SQUARE_CLIENT_ID",
            arg: "clientid",
            sensitive: true
        },
        clientSecret: {
            doc: "The Client Secret for your app.",
            format: "*",
            default: "",
            env: "SQUARE_CLIENT_SECRET",
            arg: "clientsecret",
            sensitive: true
        },
        callbackURL: {
            doc: "The callback url for your app. Should be https://<yourdomain>/auth/square/callback",
            format: "url",
            default: "http://localhost:8080/auth/square/callback",
            env: "SQUARE_CALLBACK_URL",
            arg: "callbackurl"
        },
        signatureKey: {
            doc: "The signature key for your app's webhooks.",
            format: "*",
            default: null,
            env: "SQUARE_SIGNATURE_KEY",
            arg: "signaturekey",
            sensitive: true
        }
    }
});

config.loadFile("./config.json");
config.validate({ allowed: 'strict' });

export const Config = config;
export type IConfig = typeof Config;
