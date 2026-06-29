"use server";

import generateAgentConfig from './generateAgentConfig';
import generateInstructions from './generateInstructions';

type File = { path: string; content: string };

export default async function generateProject(projectSlug: string, agentName: string, description: string, model: any, tools: any[] = [], channels: any[] = [], connections: any[] = []) {
    try {
        const files: File[] = [];

        files.push({ path: 'agent/instructions.md', content: generateInstructions(agentName, description) });
                files.push({ path: 'agent/agent.ts', content: generateAgentConfig(agentName, model) });

                // add channel files if any
                for (const channel of channels) {
                        if (channel.id === 'slack') {
                                files.push({ path: 'agent/channels/slack.ts', content: `import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel } from "eve/channels/slack";
export default slackChannel({
    credentials: connectSlackCredentials("slack/${projectSlug}"),
});` });
                        }

                        if (channel.id === 'telegram') {
                                files.push({ path: 'agent/channels/telegram.ts', content: `import { telegramChannel } from "eve/channels/telegram";
export default telegramChannel({
    botUsername: "${projectSlug}_bot",
});` });
                        }
                }

        for (const tool of tools) {
            files.push({ path: `agent/tools/${tool.id}.ts`, content: tool.code });
        }

                // add connection files
                for (const connection of connections) {
                        if (connection.id === 'mcp-local') {
                                files.push({ path: 'agent/connections/mcp-local.ts', content: `import { defineMcpClientConnection } from "eve/connections";
export default defineMcpClientConnection({
    url: "http://localhost:3001/mcp",
    description: "Local dev server.",
});` });
                        }

                        if (connection.id === 'mcp-linear') {
                                files.push({ path: 'agent/connections/mcp-linear.ts', content: `import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";
export default defineMcpClientConnection({
    url: "https://mcp.linear.app/mcp",
    description: "Linear workspace: issues, projects, cycles, and comments.",
    auth: connect("linear/${projectSlug}"),
});` });
                        }
                }

        // Delegar a escrita e arquivamento para processProject (import dinâmico para evitar ciclos)
        const { default: processProject } = await import('./processProject.action');

        const result = await processProject(projectSlug, files);
        return result;
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
