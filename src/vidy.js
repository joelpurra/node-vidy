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

module.exports = class Vidy {
    constructor(config, urls, authenticatedRequest) {
        assert.hasLength(arguments, 3);
        assert.equal(typeof config, "object");
        assert.equal(typeof urls, "object");
        assert.equal(typeof authenticatedRequest, "object");

        this.config = config;
        this.urls = urls;
        this.authenticatedRequest = authenticatedRequest;

        this.apiVersion = 3;
    }

    search(searchObject) {
        assert.hasLength(arguments, 1);
        assert.not.null(searchObject);
        assert.equal(typeof searchObject, "object");

        return Promise.resolve()
            .then(() => {
                const searchUrl = this.urls.getVersionedApiEndpointUrl("search");

                return this.authenticatedRequest.post(searchUrl, searchObject);
            });
    }

    query(q, limit) {
        assert.hasLength(arguments, 2);
        assert.nonEmptyString(q);
        assert.integer(limit);
        assert.positive(limit);

        return Promise.resolve()
            .then(() => {
                const data = {
                    q: q,
                    limits: [
                        limit,
                    ],
                };

                return this.search(data);
            });
    }
};
