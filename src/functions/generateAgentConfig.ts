import { ModelOption, ToolOption, ChannelOption, ConnectionOption } from "@/types";

export default function generateAgentConfig(
    name: string,
    model: ModelOption,
    tools: ToolOption[] = [],
    channels: ChannelOption[] = [],
    connections: ConnectionOption[] = []
): string {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'eve-agent';

    // 1. Dynamic Imports Construction
    const toolImports = tools.map(t => `import { ${t.id} } from "./tools/${t.id}";`).join("\n");
    const channelImports = channels.map(c => `import ${c.id}Channel from "./channels/${c.id}";`).join("\n");
    const connectionImports = connections.map(c => `import ${c.id}Connection from "./connections/${c.id}";`).join("\n");

    // 2. Arrays Configuration
    const toolsArray = tools.length ? `\n    ${tools.map(t => t.id).join(",\n    ")}\n  ` : "";
    const channelsArray = channels.length ? `\n    ${channels.map(c => `${c.id}Channel`).join(",\n    ")}\n  ` : "";
    const connectionsArray = connections.length ? `\n    ${connections.map(c => `${c.id}Connection`).join(",\n    ")}\n  ` : "";

    return `
import { defineAgent } from "eve";
${model.sdkImport ? `import { ${model.sdkImport} } from "${model.packageName}";` : ""}

${toolImports ? `\n${toolImports}` : ""}
${channelImports ? `\n${channelImports}` : ""}
${connectionImports ? `\n${connectionImports}` : ""}

export default defineAgent({
  model: ${model.sdkCall},${tools.length ? `\n  
    tools: [${toolsArray}],` : ""}${channels.length ? `\n  
    channels: [${channelsArray}],` : ""}${connections.length ? `\n  
    connections: [${connectionsArray}],` : ""}
});
`;
}