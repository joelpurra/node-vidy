<p align="center">
  <a href="https://vidy.com/"><img src="./resources/icon/vidy-icon-82x80.png" alt="The VIDY logotype" width="41" height="40" border="0" /></a>
</p>
<h1 align="center">
  <a href="https://github.com/joelpurra/node-vidy">VIDY API for Node.js</a>
</h1>



Search, discover, watch, and share talking videos from [VIDY](https://vidy.com/) using the [VIDY API](https://api.vidy.com/).



> ## ⚠️ This project has been archived
>
> No future updates are planned. Feel free to continue using it, but expect no support.



- Built to ease VIDY integration and testing.
- Uses the [VIDY API](https://api.vidy.com/).
- The sandbox API makes it easy to get started:
  - Open access, no special authorization required.
  - Preconfigured in the CLI tool.
  - Preconfigured in the code examples.
  - Uses a smaller dataset of VIDYs.
  - Rate limited to maximum 1 request per second.
- Requires [Node.js](https://nodejs.org/) v6.0.0 or newer.



## Command line usage

For easy developer testing, use the `vidy` command line interface (CLI).

Outputs JSON results from the VIDY API. See the [VIDY API documentation](https://api.vidy.com) for details regarding the return value format.

CLI arguments, such as API access key id and key secret, can be pre-configured using a `~/.vidyrc` file containing the respective command line options as JSON key/value pairs.

```shell
# NOTE: install vidy for system-wide usage.
npm install --global vidy

# NOTE: show the CLI help.
vidy --help

# NOTE: a simple VIDY API query.
vidy query "hello world"

# NOTE: a simple VIDY API query.
vidy search '{"q":"hello space","limits":[1],"types":["clips"],"files":["landscapeVideo240"]}'

# Pass the output to for example `jq` for processing.
# https://stedolan.github.io/jq/
vidy query --limit 3 "hello everybody" | jq
```



## Library usage

```shell
# NOTE: in your nodejs project folder.
npm install --save vidy
```

See the `./example/` directory for both example `vidy.query(...)` and `vidy.search(...)`.

See the [VIDY API documentation](https://api.vidy.com) for details regarding the return value format.

```javascript
const {
  create: createVidy,
} = require("vidy");

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

vidy.query("hello world", 1).then((vidySearchResult) => {
      const firstVideoText = vidySearchResult.clips.results[0].text;
      const firstVideoUrl = vidySearchResult.clips.results[0].files.landscapeVideo240.url;

      console.log(JSON.stringify(firstVideoText), firstVideoUrl);
  });
```



## Development

Patches welcome! Please follow [git-flow](https://danielkummer.github.io/git-flow-cheatsheet/) when submitting pull requests.



---

<a href="https://vidy.com/"><img src="./resources/icon/vidy-icon-82x80.png" alt="Screenshot of the /vidy command used in Slack" width="16" height="16" border="0" /></a> [node-vidy](https://joelpurra.com/projects/node-vidy/) Copyright &copy; 2018 [Joel Purra](https://joelpurra.com/). Released under [GNU Affero General Public License version 3.0 (AGPL-3.0)](https://www.gnu.org/licenses/agpl.html). [Your donations are appreciated!](https://joelpurra.com/donate/)
