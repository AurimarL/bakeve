# eve.wizard

An open-source interactive wizard for scaffolding [Eve](https://eve.dev) AI agent projects. Pick a template, configure your model, tools, channels and MCP connections, then download a ready-to-run project archive.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![Bun](https://img.shields.io/badge/Bun-runtime-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-black?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)

## What it does

1. **Choose a template** — blank, Slack notifier, data analyst, ops agent and more
2. **Configure** — name, system instructions, AI model (GPT-4o, Claude…), tools, channels and MCP connections
3. **Generate** — download a `.tar.gz` scaffold with all TypeScript files ready to run with `bun dev`

### Output structure

```
agent/
  agent.ts            # Eve Agent definition with selected model
  instructions.md     # Agent system prompt
  tools/<tool>.ts     # One file per selected tool
  channels/slack.ts   # Channel config (if selected)
  connections/...     # MCP connections (if selected)
package.json          # Eve project dependencies
```

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript |
| Linting | Biome |

## Getting started


```bash
# 1. Clone
git clone https://github.com/your-username/bakeve.git
cd bakeve

# 2. Install
bun install

# 3. Run
bun dev
```

Open [http://localhost:3000](http://localhost:3000).



## Contributing

Contributions are welcome — bug fixes, new templates, new tools, new providers, UI improvements. Here are the most common contribution patterns:

### Add a template

Extend `AGENT_TEMPLATES` in [`src/lib/const.ts`](src/lib/const.ts):

```ts
{
  id: "my-template",
  name: "My Template",
  description: "What this agent does.",
  agentName: "My Agent",
  instructions: "You are...",
  modelId: "gpt-4o-mini",
  toolIds: ["fetch_weather"],
  channelIds: ["slack"],
  connectionIds: [],
}
```

### Add a tool

Extend `AVAILABLE_TOOLS` in [`src/lib/const.ts`](src/lib/const.ts) with `id`, `name`, `description` and the full `code` string written to `agent/tools/<id>.ts`:

```ts
{
  id: "my_tool",
  name: "My Tool",
  description: "What it does.",
  code: `import { tool } from "eve";
import { z } from "zod";

export const my_tool = tool({
  description: "...",
  parameters: z.object({ input: z.string() }),
  execute: async ({ input }) => { return { result: input }; }
});`
}
```

### Add a model / provider

Extend `PROVIDERS` in [`src/lib/const.ts`](src/lib/const.ts). Each model needs `sdkImport`, `sdkCall` and `packageName` — used to generate the import and call in `agent.ts`:

```ts
{
  name: "Google",
  models: [
    {
      id: "gemini-2-flash",
      name: "Gemini 2.0 Flash",
      sdkImport: "google",
      sdkCall: "google('gemini-2.0-flash')",
      packageName: "@ai-sdk/google"
    }
  ]
}
```

### Add a channel or connection

- Extend `AVAILABLE_CHANNELS` / `AVAILABLE_CONNECTIONS` in `const.ts`
- Add the corresponding template function in [`src/lib/agentTemplates.ts`](src/lib/agentTemplates.ts)
- Add the builder case in [`src/functions/projectFileBuilders.ts`](src/functions/projectFileBuilders.ts)

### Development workflow

```bash
bun dev       # start dev server with hot reload
bun lint      # Biome lint check
bun format    # Biome auto-format
bun build     # production build
```

### Pull request checklist

- [ ] `bun lint` passes with no errors
- [ ] New templates/tools include a meaningful `description`
- [ ] Generated code in tool `code` strings is valid TypeScript
- [ ] No breaking changes to existing templates or the wizard flow

## License

MIT

