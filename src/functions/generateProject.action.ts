"use server";

import generateAgentConfig from './generateAgentConfig';
import generateInstructions from './generateInstructions';

type File = { path: string; content: string };

export default async function generateProject(projectSlug: string, agentName: string, description: string, model: any, tools: any[] = []) {
    try {
        const files: File[] = [];

        files.push({ path: 'agent/instructions.md', content: generateInstructions(agentName, description) });
        files.push({ path: 'agent/agent.ts', content: generateAgentConfig(agentName, model) });

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
