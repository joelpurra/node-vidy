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

const AuthenticatedRequest = require("./authenticated-request");
const Urls = require("./urls");
const Vidy = require("./vidy");

module.exports = function createVidy(config) {
    const urls = new Urls(config);
    const authenticatedRequest = new AuthenticatedRequest(config, urls);
    const vidy = new Vidy(config, urls, authenticatedRequest);

    return vidy;
};
