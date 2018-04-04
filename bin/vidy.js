#!/usr/bin/env node

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

const packageJson = require("../package.json");

const {
    create: createVidy,
} = require("../");

const runtimeConfigurator = require("./vidy-arguments");
const runtimeConfig = runtimeConfigurator();

const vidyConfig = {
    application: {
        locale: runtimeConfig.locale,
        name: packageJson.name,
        uuid: `${packageJson.name}-${packageJson.version}`,
        version: packageJson.version,
    },
    authentication: {
        keyId: runtimeConfig["key-id"],
        keySecret: runtimeConfig["key-secret"],
    },
    urls: {
        api: runtimeConfig["url-api"],
        clip: runtimeConfig["url-clip"],
        search: runtimeConfig["url-search"],
    },
};

const vidy = createVidy(vidyConfig);

const commands = {
    query: () => Promise.resolve()
        .then(() => {
            return vidy.query(runtimeConfig.keywords, runtimeConfig.limit);
        }),

    search: () => Promise.resolve()
        .then(() => {
            const vidySearchObject = JSON.parse(runtimeConfig.search);

            return vidy.search(vidySearchObject);
        }),

};

Promise.resolve()
    .then(() => {
        const command = commands[runtimeConfig.cmd];

        return command();
    })
    .then((response) => {
        /* eslint-disable no-console */
        console.log(JSON.stringify(response, null, 2));
        /* eslint-enable no-console */

        return undefined;
    })
    .catch((error) => {
        /* eslint-disable no-console */
        console.error("Command failed", error);
        /* eslint-enable no-console */
    });
