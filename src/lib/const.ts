import { Provider, ToolOption } from "@/types";

export const PROVIDERS: Provider[] = [
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


export const AVAILABLE_TOOLS: ToolOption[] = [
    {
        id: "fetch_weather",
        name: "Consultar Meteorologia",
        description: "Permite ao agente obter a previsão do tempo atual de qualquer cidade.",
        code: `import { tool } from "@vercel/eve";
import { z } from "zod";

export const fetch_weather = tool({
  description: "Obtém a meteorologia atual para uma localização dada.",
  parameters: z.object({
    city: z.string().describe("O nome da cidade, ex: Lisboa")
  }),
  execute: async ({ city }) => {
    return { location: city, temperature: "22°C", condition: "Sunny" };
  }
});`
    },
    {
        id: "send_slack",
        name: "Enviar Mensagem Slack",
        description: "Permite ao agente disparar notificações e alertas para canais do Slack.",
        code: `import { tool } from "@vercel/eve";
import { z } from "zod";

export const send_slack = tool({
  description: "Envia uma mensagem de texto formatada para o Slack.",
  parameters: z.object({
    channel: z.string().describe("Nome do canal ou ID"),
    message: z.string().describe("Conteúdo da mensagem")
  }),
  execute: async ({ channel, message }) => {
    return { success: true, channel, timestamp: Date.now() };
  }
});`
    },
    {
        id: "database_query",
        name: "Consulta SQL Básica",
        description: "Permite ao agente ler dados de forma segura de uma base de dados analítica.",
        code: `import { tool } from "@vercel/eve";
import { z } from "zod";

export const database_query = tool({
  description: "Executa consultas de leitura estruturadas na base de dados.",
  parameters: z.object({
    query: z.string().describe("Comando SQL SELECT de filtragem")
  }),
  execute: async ({ query }) => {
    return { records: [], count: 0, status: "empty_result" };
  }
});`
    }
];
