"use server";

import {
  File,
  buildAgentFiles,
  buildPackageJson,
  buildChannelFiles,
  buildToolFiles,
  buildConnectionFiles,
  buildTsconfigJson,
} from './projectFileBuilders';

export default async function generateProject(projectSlug: string, agentName: string, description: string, model: any, tools: any[] = [], channels: any[] = [], connections: any[] = []) {
  try {
    const files: File[] = [];

    // inside your generateProject server action file
    files.push(...buildAgentFiles(agentName, description, model, tools, channels, connections));
    files.push(buildPackageJson());
    files.push(buildTsconfigJson())
    files.push(...buildChannelFiles(projectSlug, channels));
    files.push(...buildToolFiles(tools));
    files.push(...buildConnectionFiles(projectSlug, connections));

    // Delegate writing and archiving to processProject (dynamic import to avoid circular deps)
    const { default: processProject } = await import('./processProject.action');

    const result = await processProject(projectSlug, files);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
