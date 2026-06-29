"use server";

import {
  File,
  buildAgentFiles,
  buildPackageJson,
  buildChannelFiles,
  buildToolFiles,
  buildConnectionFiles,
} from './projectFileBuilders';

export default async function generateProject(projectSlug: string, agentName: string, description: string, model: any, tools: any[] = [], channels: any[] = [], connections: any[] = []) {
  try {
    const files: File[] = [];

    files.push(...buildAgentFiles(agentName, description, model));
    files.push(buildPackageJson());
    files.push(...buildChannelFiles(projectSlug, channels));
    files.push(...buildToolFiles(tools));
    files.push(...buildConnectionFiles(projectSlug, connections));

    // Delegar a escrita e arquivamento para processProject (import dinâmico para evitar ciclos)
    const { default: processProject } = await import('./processProject.action');

    const result = await processProject(projectSlug, files);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
