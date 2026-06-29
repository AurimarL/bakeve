# bakeve — Eve Wizard

A web-based scaffold wizard for [Vercel Eve](https://vercel.com/blog/eve) AI agents. Fill out a form, pick a model and tools, and download a ready-to-run Eve agent project as a `.tar.gz` archive.

## What it does

1. Describe your agent (name + behavioral instructions)
2. Select an AI model (OpenAI or Anthropic)
3. Optionally attach pre-built tools (weather lookup, Slack notifications, SQL queries) and channels (Slack/Telegram)
4. Click **Compilar e Gravar Código do Agente** — the server generates and writes the project files, packages them into a `.tar.gz`, and returns it for download

The generated project contains:

```
agent/
  instructions.md           # agent role and rules
  agent.ts                  # Eve Agent config with selected model
  tools/<tool-id>.ts        # optional — one file per selected tool
  channels/<channel>.ts     # optional — Slack/Telegram channel wiring
  connections/<conn>.ts     # optional — MCP or other connections
```

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| UI | React 19 + Tailwind CSS v4 |
| Archiving | `Bun.Archive` (native gzip tar) |
| Linting/Formatting | Biome |

## Getting started

```bash
bun install
bun dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    layout.tsx, page.tsx
  components/
    wizard.tsx
    ModelSelector.tsx
    ToolsList.tsx
    TemplateSelector.tsx
    ChannelsList.tsx
    ConnectionsList.tsx
    OutputFilePreview.tsx
  functions/
    generateAgentConfig.ts      # Templates agent.ts from model metadata
    generateInstructions.ts     # Templates instructions.md from user input
    generateProject.action.ts   # Server action — assembles file list
    processProject.action.ts    # Server action — writes files + creates archive
    handleDownloadZip.ts        # Client-side .tar.gz download trigger
    projectFileBuilders.ts
  lib/
    const.ts                    # Static providers, models, agent templates, tools, channels, connections
    agentTemplates.ts           # Templates for generated agent package.json, channels, connections
  types/
    index.ts
generated-agents/               # Output directory for scaffolded agent projects
```

## Generated archive & location

When a project is generated it is written under `generated-agents/<slug>/` and the archive is saved as:

- `generated-agents/<slug>/<slug>-scaffold.tar.gz`

The server action (see [src/functions/processProject.action.ts](src/functions/processProject.action.ts)) also returns a Base64-encoded tar in `base64Tar` for client download.

## Adding models

Edit [src/lib/const.ts](src/lib/const.ts) and update the `PROVIDERS` array. Each provider includes a `models` array; each model object must include `sdkImport`, `sdkCall`, and `packageName` which are used by the generator:

Example provider entry:

```ts
{
  name: "OpenAI",
  models: [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      sdkImport: "openai",
      sdkCall: "openai('gpt-4o')",
      packageName: "@ai-sdk/openai"
    }
  ]
}
```

The generator uses these fields to import and call the SDK in the generated `agent/agent.ts`.

## Adding channels & connections

You can expose channel or connection templates by editing `AVAILABLE_CHANNELS` and `AVAILABLE_CONNECTIONS` in [src/lib/const.ts](src/lib/const.ts). Built-in examples include Slack and Telegram channels, and `mcp-local` / `mcp-linear` connections. Generated files are placed under `agent/channels/` and `agent/connections/`.

## Available built-in tools & templates

The project ships sample tools and templates defined in [src/lib/const.ts](src/lib/const.ts). Current built-in tools include:

- `fetch_weather` — simple weather lookup tool  
- `send_slack` — send a message to Slack  
- `database_query` — read-only SQL queries

Agent templates are included (e.g., "Weather Monitor", "Slack Notifier", "Data Analyst") to jump-start scaffolds.

## Adding tools

Add an entry to `AVAILABLE_TOOLS` in [src/lib/const.ts](src/lib/const.ts) with an `id`, `name`, `description`, and the full `code` string that will be written to `agent/tools/<id>.ts`.
