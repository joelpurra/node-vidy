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
    create: createVidy,
} = require("../");

const vidyConfig = {
    application: {
        locale: "en-US",
        name: "<GET FROM YOUR APPLICATION PACKAGE.JSON>",
        uuid: "<CONFIGURE ME PER INSTALLATION>",
        version: "<GET FROM YOUR APPLICATION PACKAGE.JSON>",
    },
    authentication: {
        keyId: "sandbox",
        keySecret: "sandbox",
    },
    urls: {
        api: "https://sandbox.vidy.com/",
        clip: "https://vidy.com/v/",
        search: "https://vidy.com/s/",
    },
};

const vidy = createVidy(vidyConfig);

/* eslint-disable no-console */
/* eslint-disable promise/always-return */

Promise.resolve()
    .then(() => {
        // NOTE: example simple query.
        return vidy.query("hello world", 1)
            .then((vidySearchResult) => {
                const firstVideoText = vidySearchResult.clips.results[0].text;
                const firstVideoUrl = vidySearchResult.clips.results[0].files.landscapeVideo240.url;

                console.log("Example query result", JSON.stringify(firstVideoText), firstVideoUrl);
            });
    })
    // NOTE: sleep for 1 second or more between requests, as the sandbox has a strict request rate limit.
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(() => {
        // NOTE: example search.
        const vidySearchObject = {
            q: "hello space",
            limits: [
                1,
            ],
            types: [
                "clips",
            ],
            files: [
                "landscapeVideo240",
                // "portraitVideo240",
            ],
        };

        return vidy.search(vidySearchObject)
            .then((vidySearchResult) => {
                const firstVideoText = vidySearchResult.clips.results[0].text;
                const firstVideoUrl = vidySearchResult.clips.results[0].files.landscapeVideo240.url;

                console.log("Example search result", JSON.stringify(firstVideoText), firstVideoUrl);
            });
    })
    .catch((error) => {
        console.error("Example search error", error);
    });
