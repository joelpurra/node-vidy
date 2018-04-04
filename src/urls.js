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

module.exports = class VidyUrls {
    constructor(config) {
        assert.hasLength(arguments, 1);

        // TODO: improve config object validation.
        assert.not.null(config);
        assert.equal(typeof config, "object");
        assert.not.null(config.urls);
        assert.equal(typeof config.urls, "object");
        assert.nonEmptyString(config.urls.api);
        assert.match(config.urls.api, /^https:\/\//);
        assert.match(config.urls.api, /\/$/);
        assert.nonEmptyString(config.urls.clip);
        assert.match(config.urls.clip, /^https:\/\//);
        assert.match(config.urls.clip, /\/$/);
        assert.nonEmptyString(config.urls.search);
        assert.match(config.urls.search, /^https:\/\//);
        assert.match(config.urls.search, /\/$/);

        this.config = config;

        this.apiVersion = 3;
    }

    getApiRootUrl() {
        assert.hasLength(arguments, 0);

        return this.config.urls.api;
    }

    getVersionedApiEndpointUrl(endpointName) {
        endpointName = endpointName || "";

        const apiEndpointUrl = `${this.getApiRootUrl()}${this.apiVersion}/${endpointName}`;

        return apiEndpointUrl;
    }

    getPublicClipUrl(id) {
        assert.hasLength(arguments, 1);
        assert.nonEmptyString(id);

        const clipUrl = `${this.config.urls.clip}${id}`;

        return clipUrl;
    }

    getPublicSearchUrl(str) {
        assert.hasLength(arguments, 1);
        assert.nonEmptyString(str);

        const searchUrl = `${this.config.urls.search}${str}`;

        return searchUrl;
    }
};
