'use strict';

export default class Base {
    constructor({apiClient}) {
        if (!apiClient) throw '[apiClient] required';
        this.apiClient = apiClient;
    }
}
