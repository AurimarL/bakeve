import generateAgentConfig from './generateAgentConfig';
import generateInstructions from './generateInstructions';
import { slackChannelTemplate, telegramChannelTemplate, mcpLocalConnectionTemplate, mcpLinearConnectionTemplate, packageJsonContent } from '../lib/agentTemplates';

export type File = { path: string; content: string };

export function buildAgentFiles(agentName: string, description: string, model: any): File[] {
  return [
    { path: 'agent/instructions.md', content: generateInstructions(agentName, description) },
    { path: 'agent/agent.ts', content: generateAgentConfig(agentName, model) },
  ];
}

export function buildPackageJson(): File {
  return { path: 'package.json', content: packageJsonContent() };
}

export function buildChannelFiles(projectSlug: string, channels: any[] = []): File[] {
  const files: File[] = [];
  for (const channel of channels) {
    if (channel.id === 'slack') {
      files.push({ path: 'agent/channels/slack.ts', content: slackChannelTemplate(projectSlug) });
    } else if (channel.id === 'telegram') {
      files.push({ path: 'agent/channels/telegram.ts', content: telegramChannelTemplate(projectSlug) });
    }
  }
  return files;
}

export function buildToolFiles(tools: any[] = []): File[] {
  return tools.map((tool: any) => ({ path: `agent/tools/${tool.id}.ts`, content: tool.code }));
}

export function buildConnectionFiles(projectSlug: string, connections: any[] = []): File[] {
  const files: File[] = [];
  for (const connection of connections) {
    if (connection.id === 'mcp-local') {
      files.push({ path: 'agent/connections/mcp-local.ts', content: mcpLocalConnectionTemplate() });
    } else if (connection.id === 'mcp-linear') {
      files.push({ path: 'agent/connections/mcp-linear.ts', content: mcpLinearConnectionTemplate(projectSlug) });
    } else if (connection.code && connection.id) {
      files.push({ path: `agent/connections/${connection.id}.ts`, content: connection.code });
    }
  }
  return files;
}
