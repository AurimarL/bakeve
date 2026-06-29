export function slackChannelTemplate(projectSlug: string): string {
  return `import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel } from "eve/channels/slack";
export default slackChannel({
  credentials: connectSlackCredentials("slack/${projectSlug}"),
});`;
}

export function telegramChannelTemplate(projectSlug: string): string {
  return `import { telegramChannel } from "eve/channels/telegram";
export default telegramChannel({
  botUsername: "${projectSlug}_bot",
});`;
}

export function mcpLocalConnectionTemplate(): string {
  return `import { defineMcpClientConnection } from "eve/connections";
export default defineMcpClientConnection({
  url: "http://localhost:3001/mcp",
  description: "Local dev server.",
});`;
}

export function mcpLinearConnectionTemplate(projectSlug: string): string {
  return `import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";
export default defineMcpClientConnection({
  url: "https://mcp.linear.app/mcp",
  description: "Linear workspace: issues, projects, cycles, and comments.",
  auth: connect("linear/${projectSlug}"),
});`;
}

export function packageJsonContent(): string {
  const pkg = {
    name: 'eve',
    version: '0.0.0',
    type: 'module',
    imports: {
      '#*': './agent/*',
      '#evals/*': './evals/*',
    },
    scripts: {
      build: 'eve build',
      dev: 'eve dev',
      start: 'eve start',
      typecheck: 'tsc',
    },
    dependencies: {
      '@vercel/connect': '0.2.2',
      ai: '7.0.0-beta.178',
      eve: '^0.13.6',
      zod: '4.4.3',
    },
    devDependencies: {
      '@types/node': '24.x',
      typescript: '7.0.1-rc',
    },
    overrides: {
      ai: '7.0.0-beta.178',
    },
    resolutions: {
      ai: '7.0.0-beta.178',
    },
    engines: {
      node: '24.x',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
