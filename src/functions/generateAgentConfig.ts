import { ModelOption } from "@/types";

export default function generateAgentConfig(name: string, model: ModelOption): string {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `
    import { Agent } from "@vercel/eve";
    import { ${model.sdkImport} } from "${model.packageName}";
    
    export default new Agent({
    name: "${slug || 'eve-agent'}",
    model: ${model.sdkCall},
    });
`;
}