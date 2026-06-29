# bakeve — Eve Wizard

A web-based scaffold wizard for [Vercel Eve](https://vercel.com/blog/eve) AI agents. Fill out a form, pick a model and tools, and download a ready-to-run Eve agent project as a `.tar.gz` archive.

## What it does

1. Describe your agent (name + behavioral instructions)
2. Select an AI model (OpenAI or Anthropic)
3. Optionally attach pre-built tools (weather lookup, Slack notifications, SQL queries)
4. Click **Compilar e Gravar Código do Agente** — the server generates and writes the project files, packages them into a `.tar.gz`, and returns it for download

The generated project contains:

```
agent/
  instructions.md      # agent role and rules
  agent.ts             # Eve Agent config with selected model
  tools/<tool-id>.ts   # one file per selected tool (optional)
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

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/                          # Next.js app router (layout, page)
  components/
    wizard.tsx                  # Main form and state orchestration
    ModelSelector.tsx           # AI provider/model radio group
    ToolsList.tsx               # Tool checkbox list
    OutputFilePreview.tsx       # Generated file tree + download button
  functions/
    generateAgentConfig.ts      # Templates agent.ts from model metadata
    generateInstructions.ts     # Templates instructions.md from user input
    generateProject.action.ts   # Server action — assembles file list
    processProject.action.ts    # Server action — writes files + creates archive
    handleDownloadZip.ts        # Client-side .tar.gz download trigger
  lib/
    const.ts                    # Static providers, models, and available tools
  types/
    index.ts                    # ModelOption, Provider, ToolOption interfaces
generated-agents/               # Output directory for scaffolded agent projects
```

## Adding models

Edit `src/lib/const.ts` and add an entry to the `PROVIDERS` array:

```ts
{ id: "gpt-4-turbo", name: "GPT-4 Turbo", sdkImport: "openai", sdkCall: "openai('gpt-4-turbo')", packageName: "@ai-sdk/openai" }
```

## Adding tools

Add an entry to `AVAILABLE_TOOLS` in `src/lib/const.ts` with an `id`, `name`, `description`, and the full `code` string that will be written to `agent/tools/<id>.ts`.
