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

const fs = require("fs");

const findUp = require("find-up");
const yargs = require("yargs");

const packageJson = require("../package.json");

const getJSON = (path) => {
    try {
        /* eslint-disable no-sync */
        const json = JSON.parse(fs.readFileSync(path));
        /* eslint-enable no-sync */

        return json;
    } catch (error) {
        throw new Error(`Could not read JSON file '${path}': ${error}`);
    }
};

const demandVendorProductOptions = (yargsToApplyTo) => {
    return yargsToApplyTo.demandOption(
        [
            "key-id",
            "key-secret",
        ],
        "Please provide both access key id and access key secret arguments for VIDY."
    );
};

module.exports = () => {
    const applicationBinaryName = Object.keys(packageJson.bin)[0];
    const applicationDescription = packageJson.description;
    const homepage = packageJson.homepage;

    const epilogue = `vidy Copyright © 2018 Joel Purra <https://joelpurra.com/>\n\nThis program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions. See AGPL-3.0 license for details.\n\nSee also: ${homepage}`;

    let fromImplicitConfigFile = null;

    const hasConfigFlag = process.argv.includes("--config");

    if (!hasConfigFlag) {
        const nearestConfigPath = findUp.sync([
            `.${applicationBinaryName}rc`,
            `.${applicationBinaryName}rc.json`,
        ]);
        const configFromNearestConfigPath = nearestConfigPath ? getJSON(nearestConfigPath) : {};

        fromImplicitConfigFile = configFromNearestConfigPath;
    } else {
        fromImplicitConfigFile = {};
    }

    yargs
        .strict()
        .config(fromImplicitConfigFile)
        .config("config", "Load command arguments from a JSON file.", (argumentConfigPath) => {
            const fromExplicitConfigFile = argumentConfigPath ? getJSON(argumentConfigPath) : {};

            return fromExplicitConfigFile;
        })
        .env(applicationBinaryName.toUpperCase())
        .usage(applicationDescription)
        .command("query [--limit] <keywords>", "Query the VIDY API with keywords.", (yargsToApplyTo) => {
            demandVendorProductOptions(yargsToApplyTo)
                .positional("keywords", {
                    type: "string",
                    demandOption: true,
                    describe: "Query keywords.",
                })
                .option("limit", {
                    type: "number",
                    default: 1,
                    describe: "The query result limit.",
                });
        })
        .command("search <search>", "Search the VIDY API with a search object.", (yargsToApplyTo) => {
            demandVendorProductOptions(yargsToApplyTo)
                .positional("search", {
                    type: "string",
                    default: "{}",
                    demandOption: true,
                    describe: "VIDY APU search object as a JSON string.",
                });
        })
        .option("key-id", {
            type: "string",
            default: "sandbox",
            describe: "VIDY API access key id.",
        })
        .option("key-secret", {
            type: "string",
            default: "sandbox",
            describe: "VIDY API access key secret.",
        })
        .option("locale", {
            type: "string",
            default: "en-US",
            describe: "The user's locale.",
        })
        .option("url-api", {
            type: "string",
            default: "https://sandbox.vidy.com/",
            describe: "The API root URL.",
        })
        .option("url-clip", {
            type: "string",
            default: "https://vidy.com/v/",
            describe: "The public VIDY clip base URL.",
        })
        .option("url-search", {
            type: "string",
            default: "https://vidy.com/s/",
            describe: "The public VIDY search base URL.",
        })
        // .option("verbose", {
        //     type: "boolean",
        //     default: false,
        //     describe: "Enable verbose output.",
        // })
        .demandCommand(1, 1, "Please provide a single command.", "Please provide a single command.")
        .group(
            [
                "key-id",
                "key-secret",
            ],
            "VIDY API access:"
        )
        .help()
        .example("$0 query \"hello world\"")
        .epilogue(epilogue);

    const argv = yargs.argv;

    // NOTE HACK: workaround yargs not being consistend with yargs.cmd versus yargs._ for defined/non-defined commands.
    if (typeof argv.cmd !== "string") {
        argv.cmd = argv._.shift();
    }

    return argv;
};
