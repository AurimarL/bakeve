import { AgentTemplate, Provider, ToolOption, ChannelOption, ConnectionOption } from "@/types";

export const PROVIDERS: Provider[] = [
  {
    name: "Vercel Ai Gateway",
    models: [
      { id: "gpt-4o-v", name: "GPT-4o", sdkImport: "", sdkCall: "'openai/gpt-4o'", packageName: "" },
      { id: "gpt-4o-mini-v", name: "GPT-4o Mini", sdkImport: "", sdkCall: "'openai/gpt-4o-mini'", packageName: "" }
    ]
  },
  {
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o", sdkImport: "openai", sdkCall: "openai('gpt-4o')", packageName: "@ai-sdk/openai" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", sdkImport: "openai", sdkCall: "openai('gpt-4o-mini')", packageName: "@ai-sdk/openai" }
    ]
  },
  {
    name: "Anthropic",
    models: [
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", sdkImport: "anthropic", sdkCall: "anthropic('claude-3-5-sonnet-latest')", packageName: "@ai-sdk/anthropic" }
    ]
  }
];


export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with no pre-configured settings.",
    agentName: "",
    instructions: "",
    modelId: "gpt-4o-mini",
    toolIds: [],
    channelIds: [],
  },
  {
    id: "weather-monitor",
    name: "Weather Monitor",
    description: "Agent that queries and reports current weather conditions.",
    agentName: "Weather Monitor",
    instructions: "You are a weather specialist agent. When the user asks for forecasts, use the fetch_weather tool to get up-to-date data and present it clearly and concisely.",
    modelId: "gpt-4o-mini",
    toolIds: ["fetch_weather"],
    channelIds: [],
  },
  {
    id: "slack-notifier",
    name: "Slack Notifier",
    description: "Agent that sends alerts and notifications to Slack channels.",
    agentName: "Slack Notifier",
    instructions: "You are a notifications agent. Your job is to receive requests and dispatch formatted messages to the correct Slack channels. Be concise and always include relevant context in messages.",
    modelId: "gpt-4o",
    toolIds: ["send_slack"],
    channelIds: ["slack"],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Agent that queries databases and interprets results.",
    agentName: "Data Analyst",
    instructions: "You are a senior data analyst. Use the database_query tool to run read queries, interpret the results and present clear insights. Never run queries that modify data.",
    modelId: "gpt-4o",
    toolIds: ["database_query"],
    channelIds: [],
  },
  {
    id: "ops-agent",
    name: "Ops Agent",
    description: "Combines SQL queries with Slack alerts for data pipelines.",
    agentName: "Ops Agent",
    instructions: "You are an operations agent. Monitor metrics via database_query and proactively send Slack alerts when you detect anomalies or thresholds being exceeded.",
    modelId: "gpt-4o",
    toolIds: ["database_query", "send_slack"],
    channelIds: ["slack"],
    connectionIds: ["mcp-local"],
  },
];

export const AVAILABLE_TOOLS: ToolOption[] = [
  {
    id: "fetch_weather",
    name: "Fetch Weather",
    description: "Lets the agent retrieve the current weather forecast for any city.",
    code: `import { tool } from "@vercel/eve";
import { z } from "zod";

export const fetch_weather = tool({
  description: "Gets the current weather for a given location.",
  parameters: z.object({
    city: z.string().describe("The city name, e.g. London")
  }),
  execute: async ({ city }) => {
    return { location: city, temperature: "22°C", condition: "Sunny" };
  }
});`
  },
  {
    id: "send_slack",
    name: "Send Slack Message",
    description: "Lets the agent send notifications and alerts to Slack channels.",
    code: `import { tool } from "@vercel/eve";
import { z } from "zod";

export const send_slack = tool({
  description: "Sends a formatted text message to Slack.",
  parameters: z.object({
    channel: z.string().describe("Channel name or ID"),
    message: z.string().describe("Message content")
  }),
  execute: async ({ channel, message }) => {
    return { success: true, channel, timestamp: Date.now() };
  }
});`
  },
  {
    id: "database_query",
    name: "SQL Query",
    description: "Lets the agent safely read data from an analytics database.",
    code: `import { tool } from "@vercel/eve";
import { z } from "zod";

export const database_query = tool({
  description: "Runs structured read queries against the database.",
  parameters: z.object({
    query: z.string().describe("A SQL SELECT statement")
  }),
  execute: async ({ query }) => {
    return { records: [], count: 0, status: "empty_result" };
  }
});`
  }
];

export const AVAILABLE_CHANNELS: ChannelOption[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send and receive messages via Slack using Eve's Slack channel.",
    sampleEnv: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"],
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Connect with a Telegram bot.",
    sampleEnv: ["TELEGRAM_BOT_TOKEN"],
  },
];

export const AVAILABLE_CONNECTIONS: ConnectionOption[] = [
  {
    id: "mcp-local",
    name: "MCP (Local)",
    description: "Local MCP connection for development (http://localhost:3001/mcp).",
    sampleEnv: [],
  },
  {
    id: "mcp-linear",
    name: "MCP (Linear)",
    description: "MCP connection for Linear (uses auth connect()).",
    sampleEnv: [],
  },
];
