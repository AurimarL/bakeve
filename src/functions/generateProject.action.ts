"use server";

import generateAgentConfig from './generateAgentConfig';
import generateInstructions from './generateInstructions';

type File = { path: string; content: string };

export default async function generateProject(projectSlug: string, agentName: string, description: string, model: any, tools: any[] = [], channels: any[] = []) {
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

        // Delegar a escrita e arquivamento para processProject (import dinâmico para evitar ciclos)
        const { default: processProject } = await import('./processProject.action');

        const result = await processProject(projectSlug, files);
        return result;
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
