/*
This file is part of node-vidy -- VIDY API for Node.js.
<https://github.com/joelpurra/node-vidy>

Copyright (c) 2018 Joel Purra <https://joelpurra.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const {
    assert,
} = require("check-types");

const crypto = require("crypto");
const os = require("os");

const axios = require("axios");
const moment = require("moment");

module.exports = class VidyAuthenticatedRequest {
    constructor(config, urls) {
        assert.hasLength(arguments, 2);

        // TODO: improve config object validation.
        assert.not.null(config);
        assert.equal(typeof config, "object");
        assert.not.null(config.authentication);
        assert.equal(typeof config.authentication, "object");
        assert.nonEmptyString(config.authentication.keyId);
        assert.nonEmptyString(config.authentication.keySecret);
        assert.not.null(config.application);
        assert.equal(typeof config.application, "object");
        assert.nonEmptyString(config.application.locale);
        assert.nonEmptyString(config.application.name);
        assert.nonEmptyString(config.application.uuid);
        assert.nonEmptyString(config.application.version);

        assert.equal(typeof urls, "object");

        this.config = config;
        this.urls = urls;
    }

    request(method, url, params) {
        assert.hasLength(arguments, 3);
        assert.nonEmptyString(method);
        assert.nonEmptyString(url);
        assert(url.startsWith("https://"));
        assert(url.startsWith(this.urls.getVersionedApiEndpointUrl()));
        assert.not.null(params);
        assert.equal(typeof params, "object");

        return Promise.resolve()
            .then(() => this.getHeaders(method, url))
            .then((headers) => axios.post(
                url,
                params,
                {
                    headers,
                }
            ))
            .then((response) => {
                // NOTE: axios response data.
                const data = response.data;

                return data;
            });
    }

    get(url, params) {
        return this.request("get", url, params);
    }

    post(url, params) {
        return this.request("post", url, params);
    }

    stringToBase64(str) {
        // TODO: use library.
        return Buffer.from(str, "utf8").toString("base64");
    }

    getHeaders(method, url) {
        assert.hasLength(arguments, 2);
        assert.nonEmptyString(method);
        assert.nonEmptyString(url);
        assert(url.startsWith("https://"));
        assert(url.startsWith(this.urls.getVersionedApiEndpointUrl()));

        return Promise.resolve()
            .then(() => this.getClientContext())
            .then((clientContext) => {
                const clientContextHeader = this.stringToBase64(JSON.stringify(clientContext));

                const relativeUrl = "/" + url.replace(this.urls.getApiRootUrl(), "");
                const contentType = "application/json;charset=utf-8";
                const dateHeader = new Date().toUTCString();

                const signedHeaders = {
                    "(request-target)": `${method} ${relativeUrl}`,
                    "content-type": contentType,
                    "date": dateHeader,
                    "x-client-context": clientContextHeader,
                };

                const signingHeaderKeys = Object.keys(signedHeaders);
                const signingHeaderKeysString = signingHeaderKeys.join(" ");
                const signingString = signingHeaderKeys
                    .map((headerKey) => `${headerKey}: ${signedHeaders[headerKey]}`)
                    .join("\n");

                const hmac = crypto.createHmac("sha256", this.config.authentication.keySecret);
                hmac.update(signingString);
                const signingStringHash = hmac.digest("base64");

                const clientAuthorizationHeader = `Signature keyId="${this.config.authentication.keyId}",algorithm="hmac-sha256",headers="${signingHeaderKeysString}",signature="${signingStringHash}"`;

                const headers = {
                    "content-type": contentType,
                    "date": dateHeader,
                    "x-client-authorization": clientAuthorizationHeader,
                    "x-client-context": clientContextHeader,
                };

                return headers;
            });
    }

    getClientContext() {
        assert.hasLength(arguments, 0);

        return Promise.resolve()
            .then(() => {
                // TODO: figure out better values for servers.
                const clientContext = {
                    app: {
                        build: 0,
                        name: this.config.application.name,
                        version: this.config.application.version,
                    },
                    device: {
                        id: this.config.application.uuid,
                        manufacturer: os.platform(),
                        model: os.release(),
                        name: os.platform(),
                        type: "other",
                    },
                    locale: this.config.application.locale,
                    os: {
                        name: os.platform(),
                        version: os.release(),
                    },

                    // TODO: store localtime as Date, move serialization deeper in the code?
                    // YYYY-MM-DDThh:mm:ss.mm-hh:mm (RFC 3339, explicit timezone offset)
                    localtime: moment().format(),
                };

                return clientContext;
            });
    }
};
