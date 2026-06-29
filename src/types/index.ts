export interface ModelOption {
    id: string;
    name: string;
    sdkImport: string;
    sdkCall: string;
    packageName: string;
}

export interface Provider {
    name: string;
    models: ModelOption[];
}

export interface ToolOption {
    id: string;
    name: string;
    description: string;
    code: string;
}

export interface ChannelOption {
    id: string;
    name: string;
    description: string;
    sampleEnv?: string[];
}

export interface ConnectionOption {
    id: string;
    name: string;
    description: string;
    sampleEnv?: string[];
}

export interface AgentTemplate {
    id: string;
    name: string;
    description: string;
    agentName: string;
    instructions: string;
    modelId: string;
    toolIds: string[];
    channelIds?: string[];
    connectionIds?: string[];
}