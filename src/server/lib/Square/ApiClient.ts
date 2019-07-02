/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import request from 'request-promise-native';
import { Merchant, Payment, RenewTokenResponse, WebhookEventType } from './Interfaces';

export class ApiClient {

    public static async renewAccessToken(accessToken: string, clientId: string, clientSecret: string): Promise<RenewTokenResponse> {
        return request({
            method: 'POST',
            uri: `https://connect.squareup.com/oauth2/clients/${clientId}/access-token/renew`,
            headers: { 'Authorization': `Client ${clientSecret}` },
            body: { access_token: accessToken },
            json: true
        });
    }

    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async getJSON<T>(endpoint: string): Promise<T> {
        return request({
            method: 'GET',
            uri: `https://connect.squareup.com${endpoint}`,
            headers: { 'Authorization': `Bearer ${this.accessToken}` },
            json: true
        });
    }
    private async putJSON<T>(endpoint: string, data: any): Promise<T> {
        return request({
            method: 'PUT',
            uri: `https://connect.squareup.com${endpoint}`,
            headers: { 'Authorization': `Bearer ${this.accessToken}` },
            json: true,
            body: data
        });
    }


    public async getMe() {
        return this.getJSON<Merchant>("/v1/me");
    }

    public async getPayment(location_id: string, payment_id: string) {
        return this.getJSON<Payment>(`/v1/${location_id}/payments/${payment_id}`);
    }

    public async getLocations() {
        return this.getJSON<Merchant[]>(`/v1/me/locations`);
    }

    public async registerWebhooks(entity_id: string, types: WebhookEventType[]) {
        return this.putJSON<WebhookEventType[]>(`/v1/${entity_id}/webhooks`, types);
    }

}
