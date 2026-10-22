# Altss public research skill

Read and cite Altss public pages, compare published offers and distinguish source dates from page updates. The skill points agents to current public information on [altss.com](https://altss.com/) and [Altss documentation](https://docs.altss.com/agents/public-research).

The instruction file is an exact UTF-8 copy of the [canonical public skill](https://altss.com/skills/altss-public-research/SKILL.md). It includes no credentials or executable helpers. It does not provide premium intelligence, private contacts, authenticated application access or authority to purchase anything.

## Inspect and install

Review [SKILL.md](skills/altss-public-research/SKILL.md) first. The commands below require Node.js 22.20 or later and pin the skills installer to version 1.7.4. Run them in the project where you want the skill installed.

```bash
# List the skill before making local changes
npx skills@1.7.4 add Altssdata/skills --list

# Select the client you use
npx skills@1.7.4 add Altssdata/skills --skill altss-public-research --agent codex
npx skills@1.7.4 add Altssdata/skills --skill altss-public-research --agent claude-code
```

Project-local installation and exact instruction bytes have been checked for Codex and Claude Code. These checks do not certify either client's research results or tool use. The commands install instructions; they do not install an Altss CLI or SDK.

To review updates or remove a local installation:

```bash
npx skills@1.7.4 check
npx skills@1.7.4 remove altss-public-research
```

See the [skills CLI documentation](https://github.com/vercel-labs/skills) for installer options. Repository installation counts may contribute to discovery on skills.sh; listing or ranking is not guaranteed.

## Agent rules and portable plugin

[AGENTS.md](AGENTS.md) provides repository instructions for coding agents. The root [plugin.json](plugin.json) packages the existing skill using [Agent Plugins 1.0.0](https://agent-plugins.org/specification), with the fixed `skills/altss-public-research/SKILL.md` component location. It adds no MCP server, executable helper, credentials or product permissions. Client compatibility for the plugin format must be checked by that client; the earlier installer checks above concern the skill instructions only.

## Verify the artifact

The package has no runtime dependencies. From a checkout of this repository:

```bash
# Check the package against its recorded canonical artifact digest
node scripts/verify.mjs

# Also compare the exact bytes with the current public canonical URL
node scripts/verify.mjs --live
```

[provenance.json](provenance.json) records the public source, SHA-256 digest and byte count. A digest checks integrity. Confirm publisher identity through Altss's own domain and official links before trusting a copy. The live check will fail when the website publishes a different revision; review the changed public instructions before updating this package.

## Public references

- [Agent guidance](https://altss.com/agents.md)
- [Public content index](https://altss.com/llms.txt)
- [Published offers and access rights](https://altss.com/commercial-catalog.json)
- [Public descriptive interface](https://altss.com/openapi.json)
- [Documentation MCP](https://docs.altss.com/agents/using-altss): searches public documentation and includes a provider feedback submission tool. It does not expose premium intelligence or a purchase transport.

This package preserves the existing instructions and does not add an open-source license. Refer to [Altss terms](https://altss.com/terms-of-use) for the website and published information.
