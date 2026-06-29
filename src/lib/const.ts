import { AgentTemplate, Provider, ToolOption, ChannelOption } from "@/types";

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


export const AGENT_TEMPLATES: AgentTemplate[] = [
    {
        id: "blank",
        name: "Em Branco",
        description: "Começa do zero, sem configurações pré-definidas.",
        agentName: "",
        instructions: "",
        modelId: "gpt-4o-mini",
      toolIds: [],
      channelIds: [],
    },
    {
        id: "weather-monitor",
        name: "Monitor Meteorológico",
        description: "Agente que consulta e reporta condições meteorológicas.",
        agentName: "Weather Monitor",
        instructions: "És um agente especializado em meteorologia. Quando o utilizador pedir previsões, usa a ferramenta fetch_weather para obter dados atualizados e apresenta-os de forma clara e concisa.",
        modelId: "gpt-4o-mini",
      toolIds: ["fetch_weather"],
      channelIds: [],
    },
    {
        id: "slack-notifier",
        name: "Notificador Slack",
        description: "Agente que envia alertas e notificações para canais Slack.",
        agentName: "Slack Notifier",
        instructions: "És um agente de notificações. A tua função é receber pedidos e disparar mensagens formatadas para os canais Slack corretos. Sê conciso e inclui sempre contexto relevante nas mensagens.",
        modelId: "gpt-4o",
      toolIds: ["send_slack"],
      channelIds: ["slack"],
    },
    {
        id: "data-analyst",
        name: "Analista de Dados",
        description: "Agente que consulta bases de dados e interpreta resultados.",
        agentName: "Data Analyst",
        instructions: "És um analista de dados sénior. Usa a ferramenta database_query para executar queries de leitura, interpreta os resultados e apresenta insights claros. Nunca executes queries que modifiquem dados.",
        modelId: "gpt-4o",
      toolIds: ["database_query"],
      channelIds: [],
    },
    {
        id: "ops-agent",
        name: "Agente de Operações",
        description: "Combina consultas SQL com alertas Slack para pipelines de dados.",
        agentName: "Ops Agent",
        instructions: "És um agente de operações. Monitoriza métricas via database_query e envia alertas proativos para o Slack quando detetares anomalias ou limiares ultrapassados.",
        modelId: "gpt-4o",
      toolIds: ["database_query", "send_slack"],
      channelIds: ["slack"],
    },
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

export const AVAILABLE_CHANNELS: ChannelOption[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Enviar/receber mensagens via Slack using Eve's Slack channel",
    sampleEnv: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"],
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Conectar com um bot Telegram",
    sampleEnv: ["TELEGRAM_BOT_TOKEN"],
  },
];
